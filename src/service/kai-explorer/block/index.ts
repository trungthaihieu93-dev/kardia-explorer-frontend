import { END_POINT } from "../config";
export const getBlocks = async (page: number, size: number): Promise<KAIBlock[]> => {
    const requestOptions = {
        method: 'GET'
    };

    const skip = (page - 1) * size
    const response = await fetch(`${END_POINT}blocks?skip=${skip}&limit=${size}`, requestOptions)
    const responseJSON = await response.json()

    const rawBlockList = responseJSON.data.data || []
    const nowTime = (new Date()).getTime()
    return rawBlockList.map((o: any) => {
        const createdTime = (new Date(o.time)).getTime()
        return {
            blockHash: o.hash,
            blockHeight: o.height,
            transactions: o.numTxs,
            validator: {
                label: 'Validator',
                hash: o.validator
            },
            time: new Date(o.time),
            age: (nowTime - createdTime)
        }
    })
}