import jwt from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { email: string; role: string },
  secret: string,
  expiresIn: string | number // Ensure `expiresIn` accepts valid values
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  });
};

export default createToken;
