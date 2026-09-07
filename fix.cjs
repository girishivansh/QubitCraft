const fs = require('fs');
const files = [
  'courses.ts',
  'paths.ts',
  'lessons/quantum-algorithms.ts',
  'lessons/quantum-circuit-mastery.ts'
].map(f => 'src/data/curriculum/' + f);

files.forEach(f => {
  if (fs.existsSync(f)) {
    let t = fs.readFileSync(f, 'utf8');
    t = t.replace(/\\\\'s/g, "'s");
    fs.writeFileSync(f, t);
    console.log('Fixed ' + f);
  }
});
