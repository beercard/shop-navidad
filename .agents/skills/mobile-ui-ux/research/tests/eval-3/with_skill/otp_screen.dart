// otp_screen.dart - 6-digit SMS code. ONE real TextField (paste, OS autofill, backspace and screen readers work)
// with decorative boxes behind it. Assumed server contract: verify is idempotent per challenge, code valid 10 min,
// previous code stays valid until expiry. Strings are inline for brevity: move to ARB with ICU plurals.
import 'dart:async';
import 'dart:io' show SocketException;
import 'dart:ui' show FontFeature;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'app_theme.dart';

sealed class OtpResult { const OtpResult(); }
class OtpOk extends OtpResult { const OtpOk(); }
class OtpWrong extends OtpResult { const OtpWrong(this.attemptsLeft); final int attemptsLeft; }
class OtpExpired extends OtpResult { const OtpExpired(); }
class OtpLocked extends OtpResult { const OtpLocked(this.retryAfter); final Duration retryAfter; }
class OtpServerError extends OtpResult { const OtpServerError(); }

class OtpScreen extends StatefulWidget {
  const OtpScreen({super.key, required this.maskedDestination, required this.onVerify, required this.onResend,
      required this.onVerified, required this.onChangeNumber, this.onUseEmail, this.length = 6});
  final String maskedDestination; // e.g. "+62 812 ••• 3456"
  final Future<OtpResult> Function(String code) onVerify; // throws SocketException when offline
  final Future<void> Function() onResend;
  final VoidCallback onVerified, onChangeNumber;
  final VoidCallback? onUseEmail; // alternative method when the SMS does not arrive
  final int length;
  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  static const _cooldown = 30; // seconds before resend
  static const _timeout = Duration(seconds: 15); // every loader gets a timeout exit
  final _ctrl = TextEditingController(), _focus = FocusNode();
  late DateTime _resendAt;
  Timer? _tick;
  String? _msg; // one status line: error or "code sent"
  bool _err = false, _busy = false, _done = false, _locked = false, _resending = false;
  // Deadline-based, so the countdown stays correct after the app was backgrounded.
  int get _remaining => (_resendAt.difference(DateTime.now()).inMilliseconds / 1000).ceil().clamp(0, _cooldown);
  @override
  void initState() {
    super.initState();
    _focus.addListener(() => setState(() {})); // active-box highlight
    _startCooldown();
  }
  @override
  void dispose() { _tick?.cancel(); _ctrl.dispose(); _focus.dispose(); super.dispose(); }
  void _startCooldown() {
    _resendAt = DateTime.now().add(const Duration(seconds: _cooldown));
    _tick?.cancel();
    _tick = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted || _remaining == 0) t.cancel();
      if (mounted) setState(() {});
    });
  }
  void _onChanged(String v) {
    setState(() { if (_err) { _err = false; _msg = null; } }); // error clears the moment the user edits
    if (v.length == widget.length) _submit(); // auto-submit at N; the button stays as the explicit path
  }
  void _fail(String msg, {bool clear = false, bool lock = false}) {
    HapticFeedback.mediumImpact(); // plus icon + text + border: never motion or color alone
    if (clear) _ctrl.clear(); // exception to "preserve input": a wrong or expired OTP is never reusable
    setState(() { _busy = false; _err = true; _msg = msg; _locked = lock; });
    if (!lock) _focus.requestFocus();
  }
  Future<void> _submit() async {
    if (_busy || _done) return; // ignore re-entrant taps; the button stays focusable
    final code = _ctrl.text;
    if (code.length < widget.length) return _fail('Enter all ${widget.length} digits.');
    setState(() { _busy = true; _msg = null; _err = false; });
    OtpResult? r; // null = offline
    try {
      r = await widget.onVerify(code).timeout(_timeout, onTimeout: () => const OtpServerError());
    } on SocketException {
      r = null;
    }
    if (!mounted) return;
    switch (r) {
      case OtpOk():
        HapticFeedback.lightImpact(); // user-caused result only; Flutter has no success/error haptic type
        TextInput.finishAutofillContext();
        setState(() { _busy = false; _done = true; });
        widget.onVerified();
      case OtpWrong(:final attemptsLeft):
        _fail("That code isn't right. $attemptsLeft ${attemptsLeft == 1 ? 'attempt' : 'attempts'} left.", clear: true);
      case OtpExpired():
        _fail('This code has expired. Send a new code.', clear: true);
      case OtpLocked(:final retryAfter):
        _fail('Too many attempts. Try again in ${retryAfter.inMinutes.clamp(1, 99)} min.', clear: true, lock: true);
      case OtpServerError():
        _fail("Couldn't verify the code. Your code is kept. Try again.");
      case null:
        _fail("You're offline. Reconnect, then verify. Your code is kept.");
    }
  }
  Future<void> _resend() async {
    setState(() { _resending = true; _msg = null; _err = false; });
    try {
      await widget.onResend();
      if (mounted) setState(() { _resending = false; _msg = 'New code sent to ${widget.maskedDestination}.'; _startCooldown(); });
    } catch (_) {
      if (mounted) setState(() { _resending = false; _err = true; _msg = "Couldn't send a new code. Try again."; });
    }
  }
  @override
  Widget build(BuildContext context) {
    final th = Theme.of(context), tk = AppTokens.of(context), text = th.textTheme;
    final n = widget.length, typed = _ctrl.text, left = _remaining;
    final tabular = text.bodyMedium!.copyWith(color: tk.textSecondary, fontFeatures: const [FontFeature.tabularFigures()]);
    return Scaffold(
      appBar: AppBar(title: const Text('Verify number')), // system Back stays untouched
      body: SafeArea(
        child: AutofillGroup(
          child: SingleChildScrollView( // CTA is in-flow, so the keyboard cannot cover it
            keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
            padding: const EdgeInsets.all(Space.lg),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Semantics(header: true, child: Text('Enter the $n-digit code', style: text.headlineMedium)),
              const SizedBox(height: Space.sm),
              Text('We sent it by SMS to ${widget.maskedDestination}. It expires in 10 minutes.',
                  style: text.bodyLarge!.copyWith(color: tk.textSecondary)),
              TextButton(onPressed: widget.onChangeNumber, child: const Text('Change number')),
              const SizedBox(height: Space.lg),
              Semantics(
                label: 'Verification code, $n digits',
                child: Stack(children: [
                  ExcludeSemantics(
                    child: Row(children: [
                      for (var i = 0; i < n; i++) ...[
                        if (i > 0) const SizedBox(width: Space.sm),
                        Expanded(child: _Box(char: i < typed.length ? typed[i] : '', error: _err, active: _focus.hasFocus && i == typed.length)),
                      ],
                    ]),
                  ),
                  Positioned.fill(
                    child: Theme(
                      data: th.copyWith(inputDecorationTheme: const InputDecorationTheme()), // drop the themed borders
                      child: TextField(
                        controller: _ctrl, focusNode: _focus, autofocus: true, enabled: !_locked,
                        keyboardType: TextInputType.number, textInputAction: TextInputAction.done,
                        autofillHints: const [AutofillHints.oneTimeCode], // Android SMS auto-read needs a User Consent plugin
                        autocorrect: false, enableSuggestions: false, showCursor: false,
                        style: const TextStyle(color: Colors.transparent), // the boxes render the digits
                        inputFormatters: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(n)],
                        decoration: const InputDecoration.collapsed(hintText: null),
                        onChanged: _onChanged, onSubmitted: (_) => _submit(),
                      ),
                    ),
                  ),
                ]),
              ),
              Semantics( // persistent live region: announced without moving focus
                liveRegion: true, container: true,
                child: AnimatedSwitcher( // opacity-only cross-fade; instant under Reduce Motion
                  duration: Motion.of(context, Motion.fast),
                  child: _msg == null
                      ? const SizedBox(key: ValueKey('none'), height: Space.xl)
                      : Padding(
                          key: ValueKey(_msg), padding: const EdgeInsets.only(top: Space.md),
                          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Icon(_err ? Icons.error_outline : Icons.check_circle_outline, size: 20, color: _err ? tk.danger : tk.success),
                            const SizedBox(width: Space.sm),
                            Expanded(child: Text(_msg!, style: text.bodyMedium!.copyWith(color: _err ? tk.danger : tk.success))),
                          ]),
                        ),
                ),
              ),
              const SizedBox(height: Space.lg),
              FilledButton( // never disabled: a short code gets an explanation instead of a dead button
                onPressed: _submit,
                child: Row(mainAxisSize: MainAxisSize.min, children: [
                  if (_busy) ...[
                    Motion.reduced(context)
                        ? const Icon(Icons.hourglass_top, size: 18) // static indicator under Reduce Motion
                        : SizedBox.square(dimension: 18, child: CircularProgressIndicator(strokeWidth: 2, color: th.colorScheme.onPrimary)),
                    const SizedBox(width: Space.sm),
                  ],
                  Flexible(child: Text(_busy ? 'Verifying…' : _done ? 'Verified' : 'Verify')),
                ]),
              ),
              Center(
                child: left > 0
                    ? Padding(padding: const EdgeInsets.symmetric(vertical: Space.lg), child: Text('Resend code in $left s', style: tabular))
                    : TextButton(onPressed: _resending ? null : _resend, child: Text(_resending ? 'Sending…' : 'Send a new code')),
              ),
              if (widget.onUseEmail != null) Center(child: TextButton(onPressed: widget.onUseEmail, child: const Text('Get the code by email instead'))),
            ]),
          ),
        ),
      ),
    );
  }
}

/// Decorative digit box: min (not fixed) height grows with text scale; FittedBox keeps digits unclipped at 200%.
class _Box extends StatelessWidget {
  const _Box({required this.char, required this.active, required this.error});
  final String char;
  final bool active, error;
  @override
  Widget build(BuildContext context) {
    final tk = AppTokens.of(context);
    return AnimatedContainer(
      duration: Motion.of(context, Motion.micro), curve: Motion.standard, constraints: const BoxConstraints(minHeight: 56),
      alignment: Alignment.center, // feedback motion: border colour only, no scale
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(Space.radius),
        border: Border.all(color: error ? tk.danger : active ? tk.borderFocus : tk.borderStrong, width: active || error ? 2 : 1),
      ),
      child: FittedBox(
        fit: BoxFit.scaleDown,
        child: Text(char, style: Theme.of(context).textTheme.headlineMedium!.copyWith(fontFeatures: const [FontFeature.tabularFigures()])),
      ),
    );
  }
}
