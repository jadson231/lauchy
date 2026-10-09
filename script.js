const inputs = document.querySelectorAll('.otp-inputs input');
const form = document.getElementById('mfa-form');

inputs.forEach((input, index) => {
  // Avança o cursor automaticamente para a caixa ao lado
  input.addEventListener('input', (e) => {
    if (e.target.value.length === 1 && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  });

  // Volta o cursor para a caixa anterior ao apagar (Backspace)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputs[index - 1].focus();
    }
  });

  // Permite colar os 6 dígitos de uma vez só (Ctrl+V)
  input.addEventListener('paste', (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    if (/^\d{6}$/.test(pastedData)) {
      pastedData.split('').forEach((char, i) => {
        if (inputs[i]) inputs[i].value = char;
      });
      inputs[inputs.length - 1].focus();
    }
  });
});

// Ao clicar em "Verificar Código"
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Junta os 6 dígitos num texto só
  const mfaCode = Array.from(inputs).map(i => i.value).join('');

  alert(`Código capturado: ${mfaCode}`);
  console.log("Código MFA pronto para envio:", mfaCode);
});