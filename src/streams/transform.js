import { Transform } from 'stream';

const reverse = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().trim().split('').reverse().join(''))
    callback()
  }
})

const transform = async () => {
    process.stdin.pipe(reverse).pipe(process.stdout)
};

await transform();
