CLI to easy create a new Coin on Aptos

1. Init account

```js
npx @movejs/aptos-utils@0.0.9 init --network devnet
```

2. Create coin

```js
npx @movejs/aptos-utils@0.0.9 create-coin -N CoinName -S CoinSymbol -D 6
```

3. Register to receive coin

```js
npx @movejs/aptos-utils@0.0.9 register -C d053de5173d12d539ed0a9cd9a46097e5c73422ceea169467677925b03c06ba7
```

4. Mint coin

```js
npx @movejs/aptos-utils@0.0.9 mint-coin -C d053de5173d12d539ed0a9cd9a46097e5c73422ceea169467677925b03c06ba7 -R 0x6b042d50ef3b655cac2ca5bc61557e64d0819a75e5e1c80c37a99a09e32c5eed -A 10000
```