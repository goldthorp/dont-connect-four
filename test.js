i = 5;
j = 3;

// horizontal
console.log([[i, j-3], [i, j-2], [i, j-1], [i, j]]);
console.log([[i, j-2], [i, j-1], [i, j], [i, j+1]]);
console.log([[i, j-1], [i, j], [i, j+1], [i, j+2]]);
console.log([[i, j], [i, j+1], [i, j+2], [i, j+3]]);

// vertical
console.log([i, j], [i+1, j], [i+2, j], [i+3, j]);

// diagonal up
console.log([[i-3, j-3], [i-2, j-2], [i-1, j-1], [i, j]]);
console.log([[i-2, j-2], [i-1, j-1], [i, j], [i+1, j+1]]);
console.log([[i-1, j-1], [i, j], [i+1, j+1], [i+2, j+2]]);
console.log([[i, j], [i+1, j+1], [i+2, j+2], [i+3, j+3]]);

// diagonal down
console.log([[i+3, j-3], [i+2, j-2], [i+1, j-1], [i, j]]);
console.log([[i+2, j-2], [i+1, j-1], [i, j], [i-1, j+1]]);
console.log([[i+1, j-1], [i, j], [i-1, j+1], [i-2, j+2]]);
console.log([[i, j], [i-1, j+1], [i-2, j+2], [i-3, j+3]]);

console.log('\n\n\n\n');

for(let k = -3; k <= 0; k++) {
  for(let i = k; i < k+4; i++) {
    console.log(i)
  }
  console.log('\n')
}
