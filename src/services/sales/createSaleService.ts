export interface CreateOfferActionProps {
  account: string;
  name: string;
  authorization: {
    actor: string;
    permission: string;
  }[];
  data: {
    sender: string;
    recipient: string;
    sender_asset_ids: string[];
    recipient_asset_ids: string[];
    memo: string;
  };
}

export interface AnnounceSaleActionProps {
  account: string;
  name: string;
  authorization: {
    actor: string;
    permission: string;
  }[];
  data: {
    seller: string;
    asset_ids: string[];
    listing_price: number;
    settlement_symbol: string;
    maker_marketplace: string;
  };
}

export interface CreateSaleProps {
  activeUser: any;
  createSaleActionProps: any[];
}

export async function CreateSaleService({
  activeUser,
  createSaleActionProps,
}: CreateSaleProps) {
  const actions = [...createSaleActionProps];
  const response = await activeUser.signTransaction(
    {
      actions,
    },
    {
      blocksBehind: 3,
      expireSeconds: 120,
    }
  );
  return response;
}
