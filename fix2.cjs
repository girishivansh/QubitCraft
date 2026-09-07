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
    t = t.replace(/'Grover's/g, "\\\"Grover's");
    t = t.replace(/Grover's'/g, "Grover's\\\"");
    
    // Actually simpler:
    // Let's replace any instances of 'Grover's' inside a single quoted string, or just manually fix the specific known ones.
    t = t.replace(/'Grover's Complexity'/g, '\\"Grover\\'s Complexity\\"');
    t = t.replace(/'What kind of speedup does Grover's algorithm provide over classical search\?'/g, '\\"What kind of speedup does Grover\\'s algorithm provide over classical search?\\"');
    t = t.replace(/'Shor's Algorithm'/g, '\\"Shor\\'s Algorithm\\"');
    t = t.replace(/'Shor's algorithm reduces the factoring problem to which other mathematical problem\?'/g, '\\"Shor\\'s algorithm reduces the factoring problem to which other mathematical problem?\\"');
    t = t.replace(/'A sufficiently large and fault-tolerant quantum computer could use Shor's algorithm to break much of the public-key cryptography used on the internet today.'/g, '\\"A sufficiently large and fault-tolerant quantum computer could use Shor\\'s algorithm to break much of the public-key cryptography used on the internet today.\\"');
    t = t.replace(/'Peter Shor discovered that a quantum computer can factor large integers exponentially faster than the best-known classical algorithms. This has massive implications for RSA encryption.'/g, '\\"Peter Shor discovered that a quantum computer can factor large integers exponentially faster than the best-known classical algorithms. This has massive implications for RSA encryption.\\"');
    t = t.replace(/'Einstein's Skepticism'/g, '\\"Einstein\\'s Skepticism\\"');
    
    // I need a reliable way. Let's just fix the files using regex that looks for single quotes containing 's.
    t = t.replace(/'([^']*)'s([^']*)'/g, "\\\"$1's$2\\\"");
    
    fs.writeFileSync(f, t);
    console.log('Fixed ' + f);
  }
});
