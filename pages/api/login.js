export default function handler(req, res) {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    res.setHeader('Set-Cookie', 'auth=1; Path=/; HttpOnly; Max-Age=86400');
    res.status(200).end();
  } else {
    res.status(401).end();
  }
}
