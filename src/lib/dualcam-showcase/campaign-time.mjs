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
  const units = [[Math.floor(minutes / 1440), 'day'], [Math.floor(minutes / 60) % 24, 'hour'], [minutes % 60, 'minute']];
  return units
    .filter(([amount, unit]) => amount > 0 || unit === 'minute')
    .map(([amount, unit]) => new Intl.NumberFormat(locale, {style:'unit', unit, unitDisplay:'short'}).format(amount))
    .join(' ');
}
