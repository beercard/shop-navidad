// otp_screen.dart - 6-digit SMS OTP verification. Flutter 3.27+, SDK only, no 3rd-party deps.
// ONE real TextField (autofill, paste, IME, screen reader see one field) painted as N boxes.
// Boxes are excluded from semantics. Never log or persist the code.
import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'app_theme.dart';

enum OtpResult { ok, wrongCode, expired, locked, offline }
enum _View { idle, verifying, wrong, expired, locked, offline, success }

// Every border slot is set: the app InputDecorationTheme would otherwise leak into this field.
const _n = InputBorder.none;
const _bare = InputDecoration(isCollapsed: true, filled: false, border: _n, enabledBorder: _n,
    focusedBorder: _n, disabledBorder: _n, errorBorder: _n, focusedErrorBorder: _n);

class OtpScreen extends StatefulWidget {
  const OtpScreen({
    super.key,
    required this.maskedDestination, // e.g. "+62 *** **** 1234"
    required this.verify, required this.resend,
    required this.onVerified, required this.onChangeNumber,
    this.length = 6, this.cooldown = const Duration(seconds: 30),
  });
  final String maskedDestination;
  final int length; final Duration cooldown;
  /// Throwing is treated as "can't reach server" (same UI as offline).
  final Future<OtpResult> Function(String code) verify;
  final Future<bool> Function() resend; // false = request failed
  final VoidCallback onVerified, onChangeNumber;
  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final _ctrl = TextEditingController(), _focus = FocusNode();
  Timer? _tick;
  DateTime _resendAt = DateTime.now();
  int _secsLeft = 0, _shakes = 0;
  _View _view = _View.idle;
  bool get _frozen => _view == _View.verifying || _view == _View.success;
  bool get _canSubmit =>
      _ctrl.text.length == widget.length && _view != _View.locked && _view != _View.success;
  @override
  void initState() {
    super.initState();
    _focus.addListener(() => setState(() {})); // active-box highlight
    _startCooldown();
  }
  @override
  void dispose() {
    _tick?.cancel(); _ctrl.dispose(); _focus.dispose();
    super.dispose();
  }
  // Wall-clock based, so backgrounding the app cannot freeze or skew the countdown.
  void _startCooldown() {
    _resendAt = DateTime.now().add(widget.cooldown);
    _secsLeft = widget.cooldown.inSeconds;
    _tick?.cancel();
    _tick = Timer.periodic(const Duration(seconds: 1), (_) {
      final left = math.max(0, (_resendAt.difference(DateTime.now()).inMilliseconds / 1000).ceil());
      if (left == 0) _tick?.cancel();
      if (mounted && left != _secsLeft) setState(() => _secsLeft = left);
    });
  }
  void _onChanged(String v) {
    setState(() => _view = _view == _View.locked ? _view : _View.idle);
    if (v.length == widget.length) _submit();
  }
  Future<void> _submit() async {
    if (!_canSubmit || _frozen) return;
    setState(() => _view = _View.verifying);
    OtpResult r;
    try { r = await widget.verify(_ctrl.text); } catch (_) { r = OtpResult.offline; }
    if (!mounted) return;
    switch (r) {
      case OtpResult.ok:
        HapticFeedback.lightImpact();
        setState(() => _view = _View.success);
        await Future<void>.delayed(const Duration(milliseconds: 600)); // dwell: "Verified" is announced
        if (mounted) widget.onVerified();
      case OtpResult.wrongCode: _fail(_View.wrong);
      case OtpResult.expired: _fail(_View.expired);
      case OtpResult.locked: _fail(_View.locked);
      case OtpResult.offline: setState(() => _view = _View.offline); // keep typed code for retry
    }
  }
  void _fail(_View v) {
    HapticFeedback.heavyImpact();
    setState(() { _ctrl.clear(); _view = v; _shakes++; }); // shake is zero-length under Reduce Motion
    if (v == _View.locked) { _focus.unfocus(); } else { _focus.requestFocus(); }
  }
  Future<void> _resend() async {
    setState(_startCooldown); // optimistic: disables the button at once, no double taps
    var ok = false;
    try { ok = await widget.resend(); } catch (_) {}
    if (!mounted) return;
    setState(() { // on failure: re-enable the button at once and show the offline state
      if (ok) { _ctrl.clear(); _view = _View.idle; } else { _tick?.cancel(); _secsLeft = 0; _view = _View.offline; }
    });
    if (ok) _focus.requestFocus();
  }
  (IconData, String, Color)? _status(ColorScheme s, AppTokens t) => switch (_view) {
        _View.wrong => (Icons.error_outline, 'That code is incorrect. Check the message and try again.', s.error),
        _View.expired => (Icons.timer_off_outlined, 'That code has expired. Request a new one.', s.error),
        _View.locked => (Icons.lock_outline, 'Too many attempts. For your security, try again in 15 minutes.', s.error),
        _View.offline => (Icons.wifi_off, "Can't reach the server. Check your connection and try again.", t.warning),
        _View.success => (Icons.check_circle_outline, 'Verified', t.success),
        _ => null,
      };
  Widget _field(ColorScheme s, AppTokens t, TextTheme tt) {
    final text = _ctrl.text, h = MediaQuery.textScalerOf(context).scale(28) + AppSpace.xl; // h grows with text size
    Color border(int i) => switch (_view) {
          _View.success => t.success,
          _View.wrong || _View.expired => s.error,
          _View.locked => s.outline,
          _ => _focus.hasFocus && i == math.min(text.length, widget.length - 1) ? s.primary : s.outline,
        };
    final boxes = Row(spacing: AppSpace.sm, children: [
      for (var i = 0; i < widget.length; i++)
        Expanded(
          child: AnimatedContainer(
            duration: AppMotion.d(context, AppMotion.fast), curve: AppMotion.enter,
            height: h, alignment: Alignment.center,
            decoration: BoxDecoration(color: t.fieldFill, borderRadius: BorderRadius.circular(AppSpace.radius),
                border: Border.all(color: border(i), width: border(i) == s.outline ? 1 : 2)),
            child: Text(i < text.length ? text[i] : '', style: tt.displaySmall),
          ),
        ),
    ]);
    // Damped sine, 3 swings, +-8dp. Duration is zero under Reduce Motion, so p stays 0.
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: _shakes.toDouble()), duration: AppMotion.d(context, AppMotion.shake),
      builder: (_, v, child) {
        final p = v - v.floorToDouble();
        return Transform.translate(offset: Offset(math.sin(p * math.pi * 6) * 8 * (1 - p), 0), child: child);
      },
      child: MergeSemantics(
        child: Semantics(
          label: 'Verification code, ${widget.length} digits',
          child: Stack(children: [
            ExcludeSemantics(child: boxes),
            Positioned.fill(
              child: TextField(
                controller: _ctrl, focusNode: _focus, autofocus: true, enabled: _view != _View.locked,
                expands: true, maxLines: null, minLines: null, decoration: _bare,
                keyboardType: TextInputType.number, textInputAction: TextInputAction.done,
                autofillHints: const [AutofillHints.oneTimeCode], // iOS QuickType / Android Autofill
                autocorrect: false, enableIMEPersonalizedLearning: false, enableInteractiveSelection: false, showCursor: false,
                style: const TextStyle(color: Colors.transparent), // digits are drawn by the boxes
                inputFormatters: [
                  TextInputFormatter.withFunction((o, n) => _frozen ? o : n),
                  FilteringTextInputFormatter.digitsOnly, // paste "123 456" -> "123456"
                  LengthLimitingTextInputFormatter(widget.length),
                ],
                onChanged: _onChanged, onSubmitted: (_) => _submit(),
              ),
            ),
          ]),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final th = Theme.of(context), s = th.colorScheme, tt = th.textTheme;
    final t = AppTokens.of(context), st = _status(s, t);
    final canResend = _secsLeft == 0 && _view != _View.locked && _view != _View.success;
    return Scaffold(
      appBar: AppBar(),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpace.xl),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, spacing: AppSpace.lg, children: [
            Semantics(header: true, child: Text('Enter the ${widget.length}-digit code', style: tt.headlineMedium)),
            Text('We sent it by SMS to ${widget.maskedDestination}. It expires in 5 minutes.',
                style: tt.bodyLarge?.copyWith(color: s.onSurfaceVariant)),
            _field(s, t, tt),
            ConstrainedBox( // reserved height: status text never shifts the layout
              constraints: const BoxConstraints(minHeight: 48),
              child: Semantics(
                liveRegion: true, // TalkBack/VoiceOver announce the text when it changes
                child: AnimatedSwitcher(
                  duration: AppMotion.d(context, AppMotion.base), switchInCurve: AppMotion.enter, switchOutCurve: AppMotion.exit,
                  child: st == null
                      ? const SizedBox.shrink(key: ValueKey('none'))
                      : Row(key: ValueKey(_view), spacing: AppSpace.sm, crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Icon(st.$1, color: st.$3, size: 20), // icon + text: never colour alone
                          Expanded(child: Text(st.$2, style: tt.bodyMedium?.copyWith(color: st.$3))),
                        ]),
                ),
              ),
            ),
            FilledButton(
              onPressed: _canSubmit ? _submit : null, // stays enabled while verifying (spinner)
              child: _view == _View.verifying
                  ? SizedBox.square(dimension: 20, child: CircularProgressIndicator(strokeWidth: 2.5, color: s.onPrimary, semanticsLabel: 'Verifying'))
                  : Text(_view == _View.offline ? 'Try again' : 'Verify'),
            ),
            Wrap(alignment: WrapAlignment.spaceBetween, children: [
              TextButton(onPressed: canResend ? _resend : null,
                  child: Text(canResend ? 'Resend code' : 'Resend code in ${_secsLeft}s')),
              TextButton(onPressed: widget.onChangeNumber, child: const Text('Use a different number')),
            ]),
          ]),
        ),
      ),
    );
  }
}
