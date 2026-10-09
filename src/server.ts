import express, { Request, Response } from 'express';
import { authenticator } from 'otplib';

const app = express();
app.use(express.json());

// Permite que o frontend aceda à API sem bloqueios de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Janela de tolerância para desvios de relógio (+/- 30s)
authenticator.options = { window: 1 };

// Segredo fixo para testes (num ambiente real viria da Base de Dados do utilizador)
const SECRET_DE_TESTE = 'KVKFKRCPNZQUYMLXOVYDSQKBHJ2VER3P';

app.post('/auth/mfa/verify', (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: 'O código é obrigatório.' });
  }

  // Valida o TOTP enviando o código e o segredo
  const isValid = authenticator.check(code, SECRET_DE_TESTE);

  if (isValid) {
    return res.json({ success: true, message: 'Código MFA validado com sucesso!' });
  } else {
    return res.status(401).json({ success: false, message: 'Código MFA inválido ou expirado.' });
  }
});

app.listen(3000, () => {
  console.log('Servidor MFA a rodar em http://localhost:3000');
});