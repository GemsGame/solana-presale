## solana presale program

Short instruction about how work with it. You are must have File System Wallet (Solana) in system. 

1. check witch network you are use 
`solana config get`

2. then set the blockchain network (localhost)
`solana config set --url localhost`

4. Intall packages `cargo run`

5. Create build `cargo build-bpf`

6. If you are set localhost and create build you are must run solana cluster. Open the test-ledger directory and run this command 
`solana-test-validator`

5. Deploy program. Open build directory and run `solana program deploy solana_presale.so`

__
### solana networks
`solana config set --url https://api.devnet.solana.com`
`solana config set --url https://api.mainnet-beta.solana.com`