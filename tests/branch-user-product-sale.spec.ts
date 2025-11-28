import { test, expect } from '@playwright/test';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

test('Login as Admin Create a Branch, Login as Employee Register a Product, a Client and make a Sale', async ({ page }) => {
  await page.goto('http://localhost:3000/'); await delay(750);

  await page.getByRole('textbox', { name: 'CPF/CNPJ' }).click(); await delay(750);
  await page.getByRole('textbox', { name: 'CPF/CNPJ' }).fill('51305132000162'); await delay(750);
  await page.getByRole('textbox', { name: 'Senha' }).click(); await delay(750);
  await page.getByRole('textbox', { name: 'Senha' }).fill('password'); await delay(750);
  await page.getByRole('button', { name: 'Entrar' }).click(); await delay(750);

  await page.getByRole('button', { name: 'Unidades' }).click(); await delay(750);
  await page.getByRole('button', { name: 'Nova Unidade' }).click(); await delay(750);

  await page.getByRole('textbox', { name: 'Nome da Unidade' }).click(); await delay(750);
  const random = Math.round(Math.random() * 100);
  await page.getByRole('textbox', { name: 'Nome da Unidade' }).fill(`Unidade ${random}`); await delay(750);

  await page.getByRole('textbox', { name: 'Telefone' }).click(); await delay(750);
  await page.getByRole('textbox', { name: 'Telefone' }).fill('+55999887766'); await delay(750);

  await page.getByRole('textbox', { name: 'País' }).click(); await delay(750);
  await page.getByRole('textbox', { name: 'País' }).fill('Brasil'); await delay(750);

  await page.getByRole('textbox', { name: 'Estado' }).click(); await delay(750);
  await page.getByRole('textbox', { name: 'Estado' }).fill('DF'); await delay(750);

  await page.getByRole('textbox', { name: 'Cidade' }).click(); await delay(750);
  await page.getByRole('textbox', { name: 'Cidade' }).fill('Brasilia'); await delay(750);

  await page.getByRole('textbox', { name: 'Endereço (Rua + Bairro)' }).click(); await delay(750);
  await page.getByRole('textbox', { name: 'Endereço (Rua + Bairro)' }).fill('Asa Sul'); await delay(750);

  await page.getByRole('spinbutton', { name: 'Número' }).click(); await delay(750);
  await page.getByRole('spinbutton', { name: 'Número' }).fill('114'); await delay(750);

  await page.getByRole('button', { name: 'Cadastrar Unidade' }).click(); await delay(750);

  await expect(page.getByText(`Unidade ${random}AtivaBrasil, DF`)).toHaveCount(1);
  await delay(750);

  await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click(); await delay(750);
  await page.locator('.w-10.h-6').click(); await delay(750);

  await expect(page.getByText(`Unidade ${random}AtivaBrasil, DF`)).toHaveCount(0);
  await delay(750);

  await page.getByRole('button', { name: 'Funcionários' }).click(); await delay(750);
  await page.getByRole('button', { name: 'Sair' }).click(); await delay(750);

  await page.getByRole('textbox', { name: 'CPF/CNPJ' }).click(); await delay(750);
  await page.getByRole('textbox', { name: 'CPF/CNPJ' }).fill('88390649071'); await delay(750);

  await page.getByRole('textbox', { name: 'Senha' }).click(); await delay(750);
  await page.getByRole('textbox', { name: 'Senha' }).fill('password'); await delay(750);
  await page.getByRole('button', { name: 'Entrar' }).click(); await delay(750);

  await page.getByRole('button', { name: 'Produtos' }).click(); await delay(750);
  await page.getByRole('button', { name: 'Novo Produto' }).click(); await delay(750);

  await page.getByRole('textbox', { name: 'Nome' }).fill('Produto'); await delay(750);
  await page.getByRole('textbox', { name: 'Descrição' }).click(); await delay(750);
  await page.getByRole('textbox', { name: 'Descrição' }).fill('Descrição'); await delay(750);

  await page.getByRole('textbox', { name: 'Preço (R$)' }).click(); await delay(750);
  await page.getByRole('textbox', { name: 'Preço (R$)' }).fill('1590'); await delay(750);

  await page.getByRole('textbox', { name: 'Estoque (Quantidade)' }).click(); await delay(750);
  await page.getByRole('textbox', { name: 'Estoque (Quantidade)' }).fill('110'); await delay(750);

  await page.getByRole('button', { name: 'Cadastrar Produto' }).click(); await delay(750);

  await page.getByRole('button', { name: 'Clientes' }).click(); await delay(750);
  await page.getByRole('button', { name: 'Novo Cliente' }).click(); await delay(750);

  await page.getByRole('textbox', { name: '-11' }).click(); await delay(750);
  await page.getByRole('textbox', { name: '-11' }).fill('09962074061'); await delay(750);

  await page.getByRole('textbox', { name: 'CPF Nome' }).click(); await delay(750);
  await page.getByRole('textbox', { name: 'CPF Nome' }).fill('Artur'); await delay(750);

  await page.getByRole('textbox', { name: 'Email' }).click(); await delay(750);
  await page.getByRole('textbox', { name: 'Email' }).fill('email@gmail.com'); await delay(750);

  await page.getByRole('button', { name: 'Cadastrar Cliente' }).click(); await delay(750);

  await page.getByRole('button', { name: 'Vendas' }).click(); await delay(750);
  await page.getByRole('button', { name: 'Nova Venda' }).click(); await delay(750);

  await page.getByRole('button', { name: 'Selecione um cliente... ▾' }).click(); await delay(750);
  await page.getByText('Artur - 099.620.740-').click(); await delay(750);

  await page.getByRole('button', { name: 'Selecione os produtos... ▾' }).click(); await delay(750);
  await page.getByText('Produto', { exact: true }).click(); await delay(750);

  await page.getByRole('spinbutton').fill('2'); await delay(750);
  await page.getByRole('button', { name: 'Registrar Venda' }).click(); await delay(750);

  await page.getByRole('button', { name: 'Sair' }).click(); await delay(750);
});
