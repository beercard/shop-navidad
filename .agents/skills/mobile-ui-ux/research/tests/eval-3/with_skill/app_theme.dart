// app_theme.dart - semantic tokens (placeholder brand: neutral + one blue accent). Contrast pairs computed:
// text >= 4.5:1, input border / focus >= 3:1, light and dark. Untested: increased-contrast variants.
import 'package:flutter/material.dart';

abstract final class Space {
  static const double xs = 4, sm = 8, md = 12, lg = 16, xl = 24, xxl = 32;
  static const double radius = 12, touchMin = 48; // touchMin >= 44pt iOS / 48dp Android / 24px WCAG
}

/// Motion tokens: feedback <= 150 ms, surfaces 200-300 ms, exit = 0.7 x enter.
abstract final class Motion {
  static const micro = Duration(milliseconds: 100), fast = Duration(milliseconds: 150);
  static const base = Duration(milliseconds: 250), moderate = Duration(milliseconds: 300);
  static const standard = Cubic(0.2, 0, 0, 1), enter = Cubic(0, 0, 0, 1), exit = Cubic(0.3, 0, 1, 1);
  static Duration exitOf(Duration enter) => enter * 0.7;
  /// Explicit animations must opt in; framework widgets do not honour Reduce Motion on their own.
  static bool reduced(BuildContext c) => MediaQuery.disableAnimationsOf(c);
  static Duration of(BuildContext c, Duration d) => reduced(c) ? Duration.zero : d;
}

/// Roles ColorScheme lacks. Widgets read these, never raw hex.
@immutable
class AppTokens extends ThemeExtension<AppTokens> {
  const AppTokens(this.textSecondary, this.textTertiary, this.borderStrong, this.borderFocus, this.success, this.danger);
  final Color textSecondary, textTertiary, borderStrong, borderFocus, success, danger;
  static const light = AppTokens(Color(0xFF595959), Color(0xFF6E6E6E), Color(0xFF8D8D8D), Color(0xFF0F62FE), Color(0xFF0E6027), Color(0xFFB3261E));
  static const dark = AppTokens(Color(0xFFA6A6A6), Color(0xFF8C8C8C), Color(0xFF6F6F6F), Color(0xFFFFFFFF), Color(0xFF42BE65), Color(0xFFF2B8B5));
  static AppTokens of(BuildContext c) => Theme.of(c).extension<AppTokens>()!;
  @override
  AppTokens copyWith({Color? textSecondary, Color? textTertiary, Color? borderStrong, Color? borderFocus, Color? success, Color? danger}) =>
      AppTokens(textSecondary ?? this.textSecondary, textTertiary ?? this.textTertiary, borderStrong ?? this.borderStrong,
          borderFocus ?? this.borderFocus, success ?? this.success, danger ?? this.danger);
  @override
  AppTokens lerp(AppTokens? o, double t) {
    if (o == null) return this;
    Color l(Color a, Color b) => Color.lerp(a, b, t)!;
    return AppTokens(l(textSecondary, o.textSecondary), l(textTertiary, o.textTertiary), l(borderStrong, o.borderStrong),
        l(borderFocus, o.borderFocus), l(success, o.success), l(danger, o.danger));
  }
}

ThemeData buildTheme(Brightness b) {
  final dark = b == Brightness.dark;
  final t = dark ? AppTokens.dark : AppTokens.light;
  final scheme = ColorScheme(
    brightness: b,
    primary: dark ? const Color(0xFF78A9FF) : const Color(0xFF0F62FE),
    onPrimary: dark ? const Color(0xFF001D6C) : Colors.white, // 6.4:1 dark, 5.0:1 light
    secondary: t.textSecondary, onSecondary: dark ? const Color(0xFF121212) : Colors.white,
    error: t.danger, onError: dark ? const Color(0xFF601410) : Colors.white,
    surface: dark ? const Color(0xFF121212) : Colors.white, // off-black canvas, re-authored not inverted
    onSurface: dark ? const Color(0xFFE6E6E6) : const Color(0xFF1A1A1A),
    outline: t.borderStrong,
  );
  // Type roles in sp (scale with user text size). height = line-height / size. 12 is the floor.
  TextStyle s(double size, double line, FontWeight w) => TextStyle(fontSize: size, height: line / size, fontWeight: w, color: scheme.onSurface);
  final text = TextTheme(
    headlineMedium: s(28, 36, FontWeight.w600), titleLarge: s(22, 28, FontWeight.w600), titleMedium: s(16, 24, FontWeight.w500),
    bodyLarge: s(16, 24, FontWeight.w400), bodyMedium: s(14, 20, FontWeight.w400), bodySmall: s(12, 16, FontWeight.w400),
    labelLarge: s(14, 20, FontWeight.w500),
  );
  final shape = RoundedRectangleBorder(borderRadius: BorderRadius.circular(Space.radius));
  OutlineInputBorder ob(Color c, [double w = 1]) => OutlineInputBorder(borderRadius: BorderRadius.circular(Space.radius), borderSide: BorderSide(color: c, width: w));
  return ThemeData(
    useMaterial3: true, colorScheme: scheme, textTheme: text, scaffoldBackgroundColor: scheme.surface, extensions: [t],
    materialTapTargetSize: MaterialTapTargetSize.padded,
    // Minimum sizes only (never fixed heights) so labels can wrap at 200% text.
    filledButtonTheme: FilledButtonThemeData(style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(Space.touchMin), shape: shape, textStyle: text.labelLarge)),
    textButtonTheme: TextButtonThemeData(style: TextButton.styleFrom(minimumSize: const Size(Space.touchMin, Space.touchMin), shape: shape, textStyle: text.labelLarge)),
    inputDecorationTheme: InputDecorationTheme(
      border: ob(t.borderStrong), focusedBorder: ob(t.borderFocus, 2), errorBorder: ob(t.danger, 2), focusedErrorBorder: ob(t.danger, 2),
      hintStyle: text.bodyLarge!.copyWith(color: t.textTertiary), // format example only, >= 4.5:1
    ),
    // iOS keeps the system push. Android shared-axis X (animations package, override to <= 400 ms) is wired per route.
    pageTransitionsTheme: const PageTransitionsTheme(builders: {
      TargetPlatform.android: PredictiveBackPageTransitionsBuilder(),
      TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
    }),
  );
}
