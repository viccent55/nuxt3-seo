// composables/useTimeAgo.ts
export function useTimeAgo(date: string | number | Date): string {
  let diff = (new Date().getTime() - new Date(date).getTime()) / 1000

  const times: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, 'seconds'],
    [60, 'minutes'],
    [24, 'hours'],
    [30, 'days'],
    [12, 'months'],
    [Number.POSITIVE_INFINITY, 'years'],
  ]

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  let i = 0
  while (i < times.length && diff >= times[i][0]) {
    diff /= times[i][0]
    i++
  }

  return rtf.format(-Math.floor(diff), times[i][1])
}
