export const campaignDeadline = '2026-11-30T23:59:00+08:00';
export const campaignEndTime = Date.parse(campaignDeadline);

export function campaignDate(value, locale) {
  return new Intl.DateTimeFormat(locale, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    hourCycle: 'h23', timeZone: 'Asia/Shanghai', timeZoneName: 'shortOffset',
  }).format(new Date(value));
}

export function campaignTimeLeft(now, locale) {
  const minutes = Math.max(0, Math.ceil((campaignEndTime - now) / 60_000));
  const units = [
    [Math.floor(minutes / 1440), 'day'],
    [Math.floor(minutes / 60) % 24, 'hour'],
    [minutes % 60, 'minute'],
  ];
  const digits = new Intl.NumberFormat(locale, {minimumIntegerDigits:2, useGrouping:false});
  return units.map(([amount, unit]) => {
    const localized = new Intl.NumberFormat(locale, {style:'unit', unit, unitDisplay:'short'});
    return {
      number: digits.format(amount),
      label: localized.formatToParts(amount).find(part => part.type === 'unit')?.value ?? unit,
      spoken: localized.format(amount),
    };
  });
}
