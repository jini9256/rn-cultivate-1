import styled, { css } from '@emotion/native';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { screenHeight } from '../../common/utils';
import { WHITE_COLOR, BLACK_COLOR } from '../../common/colors';

import { getDetail } from '../../common/api';
import { useQuery } from 'react-query';

import Loader from '../Loader/Loader';
import TicketModal from './TicketModal';
import TicketInfo from '../../components/MyTicket/TicketInfo';
import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { authService, dbService } from '../../common/firebase';

export default function TicketDetail({ title, navigate }) {
  const dday = 'D-Day'; //디데이 구하기 추가...구현
  const uid = authService.currentUser.uid;

  const {
    isLoading,
    isError,
    data: detail,
  } = useQuery({
    queryKey: title,
    queryFn: () => getDetail(title),
  });

  if (isLoading) {
    return <Loader />;
  }

  const {
    MAIN_IMG: imgPath,
    DATE: period,
    PLACE: place,
    USE_FEE: price,
  } = detail.culturalEventInfo.row[0];

  // console.log(title, imgPath, period, place, price);
  // console.log(detail.culturalEventInfo.row[0]);

  console.log(title);

  // 파이어베이스에 저장한 배열의 타이틀을 삭제해보자->이걸 delbookmark안으로?
  const delTicket = async () => {
    const docRef = doc(dbService, 'bookmarks', uid);
    console.log(docRef);

    await updateDoc(docRef, {
      bookmarks: arrayRemove(title),
    });
  };

  // const deleteBookmarks = () => {
  //   Alert.alert('티켓 삭제', '정말 삭제하시겠습니까?', [
  //     {
  //       text: '취소',
  //       style: 'cancel',
  //       onPress: () => console.log('취소 클릭!'),
  //     },
  //     {
  //       text: '삭제',
  //       style: 'destructive',
  //       onPress: () => {
  //         delTicket(title);
  //       },
  //     },
  //   ]);
  // };

  return (
    <SwiperChildView
      onPress={() => {
        navigate('Stack', {
          screen: 'Detail',
          params: { title },
        });
      }}
    >
      <StTicketHeader>
        <HeaderText>{dday}</HeaderText>
      </StTicketHeader>

      <Row>
        <BackgroundImg source={{ uri: imgPath }} />

        <Column>
          <TitleText>{title}</TitleText>
          <TicketInfo period={period} place={place} price="상세보기" />
        </Column>
        {/* <TicketModal /> */}
        <TicketModal
          title={title}
          delTicket={delTicket}
          imgPath={imgPath}
          period={period}
          place={place}
          price={price}
          navigate={navigate}
        />
      </Row>
    </SwiperChildView>
  );
}

const SwiperChildView = styled.TouchableOpacity`
  flex: 1;
  justify-content: flex-end;
  height: ${screenHeight / 4 + 'px'};
  margin: 10px;
  border-radius: 15px;
`;

const StTicketHeader = styled.View`
  justify-content: flex-end;
  height: ${screenHeight / 22 + 'px'};
  background-color: ${BLACK_COLOR};
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  width: 100%;
`;

const BackgroundImg = styled.Image`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  opacity: 0.2;
`;
const Column = styled.View`
  width: 65%;
  margin-left: 10px;
  margin-bottom: 10px;
`;

const Row = styled.View`
  flex: 1;
  flex-direction: row;

  align-items: center;
`;

const TitleText = styled.Text`
  word-break: break-all;
  font-size: 20px;
  font-weight: bold;
  color: ${BLACK_COLOR};
  margin-top: 10px;
  margin-bottom: 5px;
`;

const HeaderText = styled.Text`
  color: ${WHITE_COLOR};
  padding: 5px;
  font-weight: 600;
  margin-left: 10px;
`;
