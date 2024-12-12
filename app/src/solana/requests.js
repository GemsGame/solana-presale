import {
    Connection,
    SystemProgram,
    Transaction,
    PublicKey,
    TransactionInstruction,
    Keypair,
} from "@solana/web3.js";
import * as spl from '@solana/spl-token';
const borsh = require('borsh');

//const network = clusterApiUrl('devnet');
const network = 'http://localhost:8899';
const connection = new Connection(network, "confirmed");
const programId = new PublicKey("97LiUBL5E5SqLobeB9dLERHMQKUcDdrcnPVjTPgJTDeK");


export async function getWallet() {
    const resp = await window.solana.connect();
    return resp;
}

export async function getProvider() {
    const getProvider = () => {
        if ("solana" in window) {
            const provider = window.solana;
            if (provider.isPhantom) {
                return provider;
            }
        }
        window.open("https://phantom.app/", "_blank");
    };
    return await getProvider();
}

export async function setPayerAndBlockhashTransaction(instructions, provider, partSigners) {
    const transaction = new Transaction();
    instructions.forEach(element => {
        transaction.add(element);
    })
    transaction.feePayer = await provider.publicKey;
    let blockhashObj = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhashObj.blockhash;
    transaction.partialSign(partSigners);
    return transaction;
}

export async function signAndSendTransaction(transaction, provider) {
    try {
        console.log("start signAndSendTransaction");
        let signedTrans = await provider.signTransaction(transaction);
        console.log("signed transaction");
        const seri = await signedTrans.serialize();
        let signature = await connection.sendRawTransaction(seri);
        console.log("end signAndSendTransaction");
        return signature;
    } catch (err) {
        console.log("signAndSendTransaction error", err);
        throw err;
    }

}



// account structure
class CampaignDetails {
    constructor(properties) {
        Object.keys(properties).forEach((key) => {
            this[key] = properties[key];
        });
    }
    static schema = new Map([[CampaignDetails,
        {
            kind: 'struct',
            fields: [
                ['signer', [32]],
                ['temp_account', [32]],
                ['token_account', [32]],
                ['escrow_account', [32]],
                ['amount', 'u64']
           

            ]
        }]]);
}

// GENERATE TOKEN ACCOUNT FOR PROGRAM ACCOUNT

export async function generateSplTokenAccount(
    toAccount, //program data account ( campaign pubkey)
    mintAccount, //token mint address
    provider,
    wallet
) {

    ////////////////////////////////// create token account 
    const mintToken = new spl.Token(
        connection,
        mintAccount,
        spl.TOKEN_PROGRAM_ID,
        wallet //wallet owner who will pay of transaction 
    );


    const getAssociatedAccount = await spl.Token.getAssociatedTokenAddress(
        mintToken.associatedProgramId,
        mintToken.programId,
        mintAccount,
        toAccount
    );

    const receiver = await connection.getAccountInfo(getAssociatedAccount);

    const instruction = [];

    instruction.push(
        spl.Token.createAssociatedTokenAccountInstruction(
            mintToken.associatedProgramId,
            mintToken.programId,
            mintAccount,
            getAssociatedAccount,
            toAccount,
            wallet.publicKey
        )
    )


    const trans = await setPayerAndBlockhashTransaction(
        instruction,
        provider
    );

    const signature = await signAndSendTransaction(trans, provider);
    const result = await connection.confirmTransaction(signature);

    console.log(result);
}




/* 
export async function createCampaign(props) {
 
    const provider = await getProvider();
    const wallet = await getWallet();

    const mintAccount = new PublicKey(props.campaign_token_mint_account);

    const SEED = "inustart.com:" + Math.random().toString();
    const newAccount = await PublicKey.createWithSeed(
        wallet.publicKey,
        SEED,
        programId
    );

    ////////////////////////////////// create token account 
    const mintToken = new spl.Token(
        connection,
        mintAccount,
        spl.TOKEN_PROGRAM_ID,
        wallet //wallet owner who will pay of transaction 
    );


    const getAssociatedAccount = await spl.Token.getAssociatedTokenAddress(
        mintToken.associatedProgramId,
        mintToken.programId,
        mintAccount,
        newAccount,
        true
    );


    const getTokenInfo = await connection.getTokenSupply(mintAccount);

    const fromTokenAccount = await mintToken.getOrCreateAssociatedAccountInfo(
        wallet.publicKey
    );

    const receiver = await connection.getAccountInfo(getAssociatedAccount);

    const createAssociatedInsturction = spl.Token.createAssociatedTokenAccountInstruction(
        mintToken.associatedProgramId,
        mintToken.programId,
        mintAccount,
        getAssociatedAccount,
        newAccount,
        wallet.publicKey
    );

    const decimals = getTokenInfo.value.decimals;
    const tokens = props.campaign_token_count.toFixed(decimals);
    const _tokens = tokens.split('.').join("");
    const _tokens_value = Number(_tokens);

    const sendInstructions = spl.Token.createTransferInstruction(
        spl.TOKEN_PROGRAM_ID,
        fromTokenAccount.address,
        getAssociatedAccount,
        wallet.publicKey,
        [],
        _tokens_value
    );


    const campaign = new CampaignDetails({
        ...props,
        campaign_fullfiled: 0, //count
        campaign_token_mint_account: mintAccount.toBuffer(), //mint
        campaign_data_account: newAccount.toBuffer(), //data (escrow)
        campaing_token_account: getAssociatedAccount.toBuffer(), //escrow token account
        campaign_time: Date.now(), //time
        owner: wallet.publicKey.toBuffer(), //owner account
    });

    const data = borsh.serialize(CampaignDetails.schema, campaign);
    const data_to_send = new Uint8Array([0, ...data]);

    const lamports = await connection.getMinimumBalanceForRentExemption(data.length);

    const createProgramAccount = SystemProgram.createAccountWithSeed({
        fromPubkey: wallet.publicKey,
        basePubkey: wallet.publicKey,
        seed: SEED,
        newAccountPubkey: newAccount,
        lamports: lamports,
        space: data.length,
        programId: programId,
    });

    
    const instructionTOOurProgram = new TransactionInstruction({
        keys: [
            { pubkey: newAccount, isSigner: false, isWritable: true }, //TEMP token account and escrow
            { pubkey: wallet.publicKey, isSigner: true, isWritable: false }, //wallet signer
            { pubkey: spl.TOKEN_PROGRAM_ID, isSigner: false },
            { pubkey: getAssociatedAccount, isSigner: false, isWritable: true }
        ],
        programId: programId,
        data: data_to_send,
    });

    const trans = await setPayerAndBlockhashTransaction(
        [
            createProgramAccount,
            createAssociatedInsturction,
            sendInstructions,
            instructionTOOurProgram
        ],
        provider
    );

    const signature = await signAndSendTransaction(trans, provider);
    const result = await connection.confirmTransaction(signature);

    return true;
}; */

export async function createCampaign2(props) {
    /* 
      create new account for program
    */
    const mintAccount = new PublicKey(props.campaign_token_mint_account);

    //------------------ create account
    const provider = await getProvider();
    const wallet = await getWallet();

   
    //------------------ create temporary account
    const lamportsTemp = await connection.getMinimumBalanceForRentExemption(0);

    const tempAccount = new Keypair();
    const createTempTokenAccountIx = SystemProgram.createAccount({
        programId: spl.TOKEN_PROGRAM_ID,
        space: 0,
        lamports: lamportsTemp,
        fromPubkey: wallet.publicKey,
        newAccountPubkey: tempAccount.publicKey
    });
    //------------------ create temporary account

    //------------------ create temporary token account
    const mintToken = new spl.Token(
        connection,
        mintAccount,
        spl.TOKEN_PROGRAM_ID,
        wallet 
    );

    const fromTokenAccount = await mintToken.getOrCreateAssociatedAccountInfo(
        wallet.publicKey
    );

    const getAssociatedAccount = await spl.Token.getAssociatedTokenAddress(
        mintToken.associatedProgramId,
        mintToken.programId,
        mintAccount,
        tempAccount.publicKey,
    );
    
    const createAssociatedInsturction = spl.Token.createAssociatedTokenAccountInstruction(
        mintToken.associatedProgramId,
        mintToken.programId,
        mintAccount,
        getAssociatedAccount,
        tempAccount.publicKey,
        wallet.publicKey
    );

  
    //------------------ create temporary token account

    const SEED = "inustart.com:" + Math.random().toString();
    const newAccount = await PublicKey.createWithSeed(
        wallet.publicKey,
        SEED,
        programId
    );
   
    //------------------------------------------------------
    const campaign = new CampaignDetails({
        signer: wallet.publicKey.toBuffer(), //owner account
        temp_account: tempAccount.publicKey.toBuffer(),
        token_account: getAssociatedAccount.toBuffer(),
        escrow_account: newAccount.toBuffer(),
        amount: 1 
    });

    const data = borsh.serialize(CampaignDetails.schema, campaign);
    const data_to_send = new Uint8Array([2, ...data]);

    const lamp = await connection.getMinimumBalanceForRentExemption(data.length);

    const createProgramAccount = SystemProgram.createAccountWithSeed({
        fromPubkey: wallet.publicKey,
        basePubkey: wallet.publicKey,
        seed: SEED,
        newAccountPubkey: newAccount,
        lamports: lamp,
        space: data.length,
        programId: programId,
    });
    //------------------------------------------------------



    //------------------ create account


    //------------------ create token transfer
    
    const sendInstructions = spl.Token.createTransferInstruction(
       spl.TOKEN_PROGRAM_ID,
       fromTokenAccount.address,
       getAssociatedAccount,
       wallet.publicKey,
       [],
       1
    );
    
    //------------------ create token transfer


    
    const instructionTOOurProgram = new TransactionInstruction({
        keys: [
            { pubkey: wallet.publicKey, isSigner: true }, //signer
            { pubkey: tempAccount.publicKey, isSigner: false, isWritable: true}, // temp account
            { pubkey: getAssociatedAccount, isSigner: false }, // token
            { pubkey: newAccount, isSigner: false, isWritable: true }, // escrow
            { pubkey: spl.TOKEN_PROGRAM_ID, isSigner: false }, // token
        ],
        programId: programId,
        data: data_to_send
    });


    const trans = await setPayerAndBlockhashTransaction(
        [ createTempTokenAccountIx,
          createProgramAccount,
          createAssociatedInsturction,
          instructionTOOurProgram,
         //sendInstructions
        ],
        provider,
        tempAccount
    );

    const signature = await signAndSendTransaction(trans, provider);
    const result = await connection.confirmTransaction(signature);

};

export async function getAllCampaigns() {
    let accounts = await connection.getProgramAccounts(programId);
    //accounts = accounts.splice(0, 2);
    let campaigns = [];
    accounts.forEach((e) => {
        try {

            let campData = borsh.deserialize(CampaignDetails.schema, CampaignDetails, e.account.data);

            campaigns.push({
                pubId: e.pubkey,
                campaign_name: campData.campaign_name,
                campaign_description: campData.campaign_description,
                campaign_image: campData.campaign_image,
                campaign_token_mint_account: campData.campaign_token_mint_account,
                campaign_token_count: campData.campaign_token_count,
                campaign_amount: campData.campaign_amount,
                campaign_fullfiled: campData.campaign_fullfiled,
                campaign_time: campData.campaign_time,
                owner: campData.owner,
                campaign_data_account: campData.campaign_data_account,
                campaing_token_account: campData.campaing_token_account
            });
        } catch (err) {
            return new Error('Not valid campaign structure');
        }
    });
    //return campaigns.sort((a, b) => b.campaign_time.toNumber() - a.campaign_time.toNumber());
    return campaigns;
}


export async function getOrCreateATA(  //associated token account
    tokenMintAccount,
    wallet,
    toWallet
) {

    const mintAccount = new PublicKey(tokenMintAccount);

    const instuctions = [];
    ////////////////////////////////// create token account 
    const mintToken = new spl.Token(
        connection,
        mintAccount, //ok
        spl.TOKEN_PROGRAM_ID,
        wallet //wallet owner who will pay of transaction 
    );

    const getAssociatedAccount = await spl.Token.getAssociatedTokenAddress(
        mintToken.associatedProgramId,
        mintToken.programId,
        mintAccount,
        toWallet,
        true
    );

    const receiver = await connection.getAccountInfo(getAssociatedAccount);

    if (receiver === null) {
        instuctions.push(
            spl.Token.createAssociatedTokenAccountInstruction(
                mintToken.associatedProgramId,
                mintToken.programId,
                mintAccount,
                getAssociatedAccount,
                toWallet,
                wallet.publicKey
            ));
    }

    return { getAssociatedAccount, instuctions };
    //////////////////////////////////////////////////
};



export async function donateToCampaign(
    pubId, sol, item
) {

    const provider = await getProvider();
    const wallet = await getWallet();
    const associated_account = await getOrCreateATA(item.campaign_token_mint_account, wallet, wallet.publicKey); //donator

    const mintAccount = new PublicKey(item.campaign_token_mint_account);
    const associated = new PublicKey(pubId);
    ////////////////////////////////// create token account 
    const mintToken = new spl.Token(
        connection,
        mintAccount, //ok
        spl.TOKEN_PROGRAM_ID,
        wallet //wallet owner who will pay of transaction 
    );

    const getAssociatedAccount = await spl.Token.getAssociatedTokenAddress(
        mintToken.associatedProgramId,
        mintToken.programId,
        mintAccount,
        associated,
        true
    );

    const receiver = await connection.getAccountInfo(getAssociatedAccount);

    const SEED = "inustart.com:" + Math.random().toString();
    let newAccount = await PublicKey.createWithSeed(
        wallet.publicKey,
        SEED,
        programId
    );


    const createProgramAccount = SystemProgram.createAccountWithSeed({
        fromPubkey: wallet.publicKey,
        basePubkey: wallet.publicKey,
        seed: SEED,
        newAccountPubkey: newAccount,
        lamports: sol,
        space: 1,
        programId: programId,
    });


    const instructionTOOurProgram = new TransactionInstruction({
        keys: [
            { pubkey: pubId, isSigner: false, isWritable: true }, //writing_account
            { pubkey: newAccount, isSigner: false, }, // donator_program_account
            { pubkey: wallet.publicKey, isSigner: true }, //donator
            { pubkey: associated_account.getAssociatedAccount, isSigner: false, isWritable: true }, //donator_associated_token_account
            { pubkey: spl.TOKEN_PROGRAM_ID, isSigner: false }, // token_program_id_account
            { pubkey: new PublicKey(item.campaing_token_account), isSigner: false, isWritable: true },  // campaign token account
            { pubkey: new PublicKey(item.campaign_data_account), isSigner: false }, //campaign_data_account

        ],
        programId: programId,
        data: new Uint8Array([1])
    });


    const trans = await setPayerAndBlockhashTransaction(
        [
            createProgramAccount,
            instructionTOOurProgram,
            ...associated_account.instuctions],
        provider
    );
    const signature = await signAndSendTransaction(trans, provider);
    const result = await connection.confirmTransaction(signature);
}

