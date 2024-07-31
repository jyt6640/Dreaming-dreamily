const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cors = require('cors'); // CORS 패키지 임포트

const app = express();
const PORT = 3000;

// CORS 설정
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/nextTxt', (req, res) => {
    // 가라 줄거리 배열
    const 줄거리들 = ['토끼 선생님은 매일 아침 일찍 일어나 산책을 하곤 했어요.', '토끼 선생님은 아침을 먹고 산책을 나갔어요.', '산책 도중에 토끼 선생님은 아름다운 꽃밭을 발견했어요.', '토끼 선생님은 산책을 하다가 친구를 만났어요.', '토끼 선생님은 산책을 하며 자연의 소리를 즐겼어요.'];
    const 다음선택지 = ['산책을 하다 넘어졌어요', '산책을 하다 거북이를 만났어요'];
    // 줄거리 배열에서 무작위로 하나의 줄거리 선택
    const 다음줄거리 = 줄거리들[Math.floor(Math.random() * 줄거리들.length)];

    const body = req.body;
    // 숫자로 변환 가능한 키를 찾음
    const 숫자키 = Object.keys(body).find((key) => !isNaN(Number(body[key])));
    // 추출한 숫자키를 숫자로 변환
    const 다음페이지번호 = Number(body[숫자키]);

    res.send({ 다음줄거리, 다음페이지번호, 다음선택지 });
});

// 이미지 데이터를 받아서 서버에 저장하는 엔드포인트 라우터
app.post('/save-canvas', async (req, res) => {
    const 선택한책고유번호 = req.body.선택한책고유번호;
    const 다음페이지번호 = req.body.새로운페이지번호;
    const 이미지데이터 = req.body.imageData;
    const base64Data = 이미지데이터.replace(/^data:image\/png;base64,/, '');
    const dirPath = path.join(__dirname, 'public', 'books');
    const uniqueFilename = `${선택한책고유번호}-${다음페이지번호}-2.png`;
    const filePath = path.join(dirPath, uniqueFilename);

    try {
        // 기존 파일이 있으면 삭제
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            console.log('기존 파일 삭제:', filePath);
        }

        console.log('파일 저장:', filePath);

        // base64 데이터를 파일로 변환하여 지정된 경로에 저장
        await fs.promises.writeFile(filePath, base64Data, 'base64');

        // 응답 헤더 설정
        res.json({ message: '이미지 저장 성공', filename: uniqueFilename });
    } catch (err) {
        console.error('이미지 저장 중 오류 발생:', err);
        res.status(500).send('이미지 저장 실패');
    }
});

app.post('/nextImg', async (req, res) => {
    const 선택한책고유번호 = req.body.선택한책고유번호;
    const 다음페이지번호 = req.body.새로운페이지번호;
    const 가라삽화 = 'https://picsum.photos/480/640?id=' + Math.random();
    const filename = `${선택한책고유번호}-${다음페이지번호}-1.png`;
    const filePath = path.join(__dirname, 'public', 'books', filename);

    try {
        // 기존 파일이 있으면 삭제
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            console.log('기존 파일 삭제:', filePath);
        }

        // 이미지 다운로드
        const response = await axios({
            url: 가라삽화,
            method: 'GET',
            responseType: 'arraybuffer',
        });

        // Buffer로 변환된 이미지를 파일에 저장
        const buffer = Buffer.from(response.data, 'binary');
        await fs.promises.writeFile(filePath, buffer);

        console.log('파일 저장:', filePath);
        res.json({ message: '이미지 저장 성공', filename });
    } catch (err) {
        console.error('이미지 저장 중 오류 발생:', err);
        res.status(500).send('이미지 저장 실패');
    }
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
