const { withAndroidManifest } = require(
  require.resolve('@expo/config-plugins', { paths: [require.resolve('expo')] }),
);

/**
 * 알람 앱에 필요한 Android 설정을 MainActivity에 추가:
 * 1. SET_ALARM intent-filter  → 시스템이 이 앱을 알람 앱으로 인식
 *    (USE_FULL_SCREEN_INTENT 자동 부여 조건)
 * 2. showWhenLocked / turnScreenOn → 잠금화면에서 알람 화면 표시
 */
module.exports = function withAndroidAlarmConfig(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    const activities = manifest.application?.[0]?.activity ?? [];

    const mainActivity = activities.find(
      (a) => a.$['android:name'] === '.MainActivity',
    );

    if (!mainActivity) return config;

    // showWhenLocked / turnScreenOn 속성 추가
    mainActivity.$['android:showWhenLocked'] = 'true';
    mainActivity.$['android:turnScreenOn'] = 'true';

    // SET_ALARM intent-filter 추가 (중복 방지)
    const filters = mainActivity['intent-filter'] ?? [];
    const alreadyHasSetAlarm = filters.some((f) =>
      (f.action ?? []).some(
        (a) => a.$['android:name'] === 'android.intent.action.SET_ALARM',
      ),
    );

    if (!alreadyHasSetAlarm) {
      filters.push({
        action: [{ $: { 'android:name': 'android.intent.action.SET_ALARM' } }],
        category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
      });
      mainActivity['intent-filter'] = filters;
    }

    return config;
  });
};
