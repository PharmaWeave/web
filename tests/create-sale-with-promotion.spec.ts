import { expect, test } from '@playwright/test';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

test('test', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    await page.getByRole('textbox', { name: 'CPF/CNPJ' }).click(); await delay(750);
    await page.getByRole('textbox', { name: 'CPF/CNPJ' }).fill('88390649071'); await delay(750);

    await page.getByRole('textbox', { name: 'Senha' }).click(); await delay(750);
    await page.getByRole('textbox', { name: 'Senha' }).fill('password'); await delay(750);

    await page.getByRole('button', { name: 'Entrar' }).click(); await delay(750);

    await page.getByRole('button', { name: 'Vendas' }).click(); await delay(750);
    await page.getByRole('button', { name: 'Nova Venda' }).click(); await delay(750);

    await page.getByRole('button', { name: 'Selecione um cliente... ▾' }).click(); await delay(750);
    await page.getByText('Artur - 099.620.740-').click(); await delay(750);

    await page.getByRole('button', { name: 'Selecione os produtos... ▾' }).click(); await delay(750);
    await page.getByText('Produto', { exact: true }).click(); await delay(750);

    await page.getByRole('spinbutton').fill('10'); await delay(750);

    await page.getByRole('button', { name: 'Selecione uma promoção... ▾' }).click(); await delay(750);
    await page.getByText('Titulo - Descrição').click(); await delay(750);
    await page.getByRole('button', { name: 'Registrar Venda' }).click(); await delay(750);

    await expect(page.getByRole('cell', { name: '139.00' })).toHaveCount(1); await delay(750);

    await page.getByRole('button', { name: 'Sair' }).click(); await delay(750);
});