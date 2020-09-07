export function normalize(s) {
  s = s || '';
  s = s.toString();
  return s
    .replace(/(\d\d)(\/)(\d\d)(\/)(\d\d\d\d)/g, '$5-$3-$1')
    .replace(/(\d{1,2}\.\d\d\.\d\d)\s([AP]M)/g, (_, t, m) => {
      var p = t.split('.').map(Number);
      if (p[0] === 12) {
        p[0] = 0;
      }
      if (m === 'PM') {
        p[0] += 12;
      }
      return p.map(v => v.toString().padStart(2, '0')).join(':');
    });
}
