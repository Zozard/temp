export type Notice = {
    id: number;
    status: string;
    sender_id: string;
    sender_name: string;
    offered_card_id: string;
    offered_func_id: string;
    offered_name: string;
    requested_card_id: string;
    requested_func_id: string;
    requested_name: string;
    created_at: Date;
};