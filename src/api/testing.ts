export async function fakeLoadApi(req: any) {
    return {
        list: [],
        page: req.page,
        pageSize: req.pageSize,
        pageCount: 10,
        itemCount: 100,
    };
}

export async function fakeCreateApi(data: any) {
    console.log(JSON.parse(JSON.stringify(data)));
}

export async function fakeEditApi(data: any) {
    console.log(JSON.parse(JSON.stringify(data)));
}

export async function fakeDeleteApi(data: any) {
    console.log(JSON.parse(JSON.stringify(data)));
}
