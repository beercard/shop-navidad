// app_theme.dart - design tokens + ThemeData. Flutter 3.27+ / Dart 3. Brand hues are PLACEHOLDERS.
// WCAG 2.x contrast computed for the overridden roles only (text >= 4.5:1, outline >= 3:1 on
// surface and fieldFill, light + dark). Roles left to ColorScheme.fromSeed are NOT audited.
import 'package:flutter/material.dart';

abstract final class AppSpace {
  static const double xs = 4, sm = 8, md = 12, lg = 16, xl = 24, xxl = 32, radius = 12;
  static const double minTouch = 48; // Android 48dp; iOS HIG minimum is 44pt
}
/// Motion tokens. ALWAYS read durations through [d] so Reduce Motion is honoured.
abstract final class AppMotion {
  static const fast = Duration(milliseconds: 120); // colour/state changes
  static const base = Duration(milliseconds: 200); // fades, small moves
  static const slow = Duration(milliseconds: 320); // sheets, hero moves
  static const shake = Duration(milliseconds: 360); // wrong-code cue
  static const enter = Curves.easeOutCubic; // things arriving
  static const exit = Curves.easeInCubic; // things leaving
  /// Zero when the OS "remove animations / reduce motion" flag is on.
  static Duration d(BuildContext c, Duration v) =>
      MediaQuery.disableAnimationsOf(c) ? Duration.zero : v;
}

/// Semantic colours that ColorScheme has no slot for (borders use scheme.outline).
@immutable
class AppTokens extends ThemeExtension<AppTokens> {
  const AppTokens({required this.success, required this.warning, required this.fieldFill});
  final Color success, warning, fieldFill;
  static AppTokens of(BuildContext c) => Theme.of(c).extension<AppTokens>()!;
  @override
  AppTokens copyWith({Color? success, Color? warning, Color? fieldFill}) => AppTokens(
      success: success ?? this.success, warning: warning ?? this.warning,
      fieldFill: fieldFill ?? this.fieldFill);

  @override
  AppTokens lerp(AppTokens? o, double t) => o == null
      ? this
      : AppTokens(
          success: Color.lerp(success, o.success, t)!, warning: Color.lerp(warning, o.warning, t)!,
          fieldFill: Color.lerp(fieldFill, o.fieldFill, t)!);
}
abstract final class AppTheme {
  static const _seed = Color(0xFF0B5FFF);
  static ThemeData get light => _build(
        ColorScheme.fromSeed(seedColor: _seed).copyWith(
          primary: _seed, onPrimary: Colors.white, error: const Color(0xFFB3261E),
          onError: Colors.white, surface: Colors.white, onSurface: const Color(0xFF11151C),
          onSurfaceVariant: const Color(0xFF4A5261), outline: const Color(0xFF6F7889)),
        const AppTokens(success: Color(0xFF0F7B4B), warning: Color(0xFF8A5300), fieldFill: Color(0xFFF3F5F8)),
      );
  static ThemeData get dark => _build(
        ColorScheme.fromSeed(seedColor: _seed, brightness: Brightness.dark).copyWith(
          primary: const Color(0xFF8AB4FF), onPrimary: const Color(0xFF0B1A33),
          error: const Color(0xFFFFB4AB), onError: const Color(0xFF410E0B),
          surface: const Color(0xFF0F131A), onSurface: const Color(0xFFE8ECF3),
          onSurfaceVariant: const Color(0xFFAAB3C2), outline: const Color(0xFF8791A3)),
        const AppTokens(success: Color(0xFF6FD6A0), warning: Color(0xFFF2B866), fieldFill: Color(0xFF1A202A)),
      );
  static ThemeData _build(ColorScheme s, AppTokens t) {
    final base = ThemeData(useMaterial3: true, colorScheme: s);
    // System fonts on purpose: no network font fetch on a flaky connection. Sizes are sp
    // and follow the OS text size. copyWith (not replace) keeps colours in dark mode.
    final tt = base.textTheme.apply(bodyColor: s.onSurface, displayColor: s.onSurface);
    OutlineInputBorder border(Color c, double w) => OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppSpace.radius), borderSide: BorderSide(color: c, width: w));
    return base.copyWith(
      scaffoldBackgroundColor: s.surface,
      extensions: [t],
      materialTapTargetSize: MaterialTapTargetSize.padded,
      textTheme: tt.copyWith(
        headlineMedium: tt.headlineMedium?.copyWith(fontSize: 28, height: 1.2, fontWeight: FontWeight.w700),
        bodyLarge: tt.bodyLarge?.copyWith(fontSize: 16, height: 1.5),
        // displaySmall = OTP / amount figures: tabular so digits don't jitter.
        displaySmall: tt.displaySmall?.copyWith(fontSize: 28, height: 1.2, fontWeight: FontWeight.w600,
            fontFeatures: const [FontFeature.tabularFigures()]),
      ),
      filledButtonTheme: FilledButtonThemeData(style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(52))),
      inputDecorationTheme: InputDecorationTheme(
        filled: true, fillColor: t.fieldFill, contentPadding: const EdgeInsets.all(AppSpace.lg),
        border: border(s.outline, 1), focusedBorder: border(s.primary, 2),
        errorBorder: border(s.error, 2), focusedErrorBorder: border(s.error, 2),
      ), // page transitions: platform defaults (iOS swipe-back, Android predictive back)
    );
  }
}
