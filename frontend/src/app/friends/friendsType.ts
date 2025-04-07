export type UserFriendsRes = {
    id: string,
    name: string,
    username: string,
    planet: string,
    avatarUrl?: string
};

export type GalaxyBoostRes = {
    sender_id: string,
    sender_name: string,
    reciever_id: string,
    message: string,
    sent_at: string,
}