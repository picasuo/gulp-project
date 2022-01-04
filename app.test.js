// import app from 'app';
const app = require('./app');
const request = require('supertest');
let a = 1;
describe('test', function () {
  let server = null;

  beforeEach(function (done) {
    server = app.listen(0, function (err) {
      if (err) {
        return done(err);
      }
      let aa = `第${a++}次`;
      console.log(err, aa);
      done();
    });
  });

  afterEach(function () {
    server.close();
  });

  it('Status code should be 200', function (done) {
    request(app).get('/').expect(200, done);
  });

  it('Test /users response', function (done) {
    request(app)
      .get('/users')
      .expect(200)
      .expect('respond with a resource', done);
  });
});
