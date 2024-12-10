import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const res = await request.json();
    const sessionToken = res.data?.token;
    
    if (!sessionToken) {
        return Response.json({ message: 'Không nhận được token' }, {
            status: 400
        });
    }

    const cookieStore = cookies();
    cookieStore.set('sessionToken', sessionToken, {
        path: '/',
        httpOnly: true,
        secure: false, // Đảm bảo rằng bạn đang chạy trên HTTPS nếu sử dụng secure: true
        sameSite: 'strict',
    });

    return Response.json({ message: 'Đăng nhập thành công', sessionToken }, {
        status: 200
    });
}