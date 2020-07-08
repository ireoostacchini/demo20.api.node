const axios = require('axios');
const errorDtoCodes = require('../app/constants/errorDtoCodes');

describe('errors', () => {
  it('returns a 404 error', async (done) => {
    try {
      const result = await axios.get(
        `${process.env.BASE_URL}/errors/xxxxxxxxxxxxxxxxxxx`
      );
      throw new Error('error not returned');
    } catch (err) {
      const error = err.response.data.error;
      expect(error.status).toEqual(404);
      expect(error.code).toEqual(errorDtoCodes.notFound);
    }

    done();
  });

  it('returns a 500 error', async (done) => {
    try {
      const result = await axios.get(`${process.env.BASE_URL}/errors/fail500`);
      throw new Error('error not returned');
    } catch (err) {
      const error = err.response.data.error;
      expect(error.status).toEqual(500);
      expect(error.code).toEqual(errorDtoCodes.internalServerError);
    }

    done();
  });

  it('returns a 400 error', async (done) => {
    try {
      const result = await axios.get(`${process.env.BASE_URL}/errors/fail400`);
      throw new Error('error not returned');
    } catch (err) {
      const error = err.response.data.error;
      expect(error.status).toEqual(400);
      expect(error.code).toEqual(errorDtoCodes.badRequest);
    }

    done();
  });

  it('returns a 500 error asynchronously', async (done) => {
    try {
      const result = await axios.get(
        `${process.env.BASE_URL}/errors/asyncfail500`
      );
      throw new Error('error not returned');
    } catch (err) {
      const error = err.response.data.error;
      expect(error.status).toEqual(500);
      expect(error.code).toEqual(errorDtoCodes.internalServerError);
    }

    done();
  });

  it('returns a 400 error asynchronously', async (done) => {
    try {
      const result = await axios.get(
        `${process.env.BASE_URL}/errors/asyncfail400`
      );
      throw new Error('error not returned');
    } catch (err) {
      const error = err.response.data.error;
      expect(error.status).toEqual(400);
      expect(error.code).toEqual(errorDtoCodes.badRequest);
    }

    done();
  });

  it('returns a custom error', async (done) => {
    try {
      const result = await axios.get(
        `${process.env.BASE_URL}/errors/failcustom`
      );
      throw new Error('error not returned');
    } catch (err) {
      const error = err.response.data.error;
      expect(error.status).toEqual(500);
      expect(error.code).toEqual(errorDtoCodes.myCustomErrorCode);
    }

    done();
  });
});
