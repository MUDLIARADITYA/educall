import React from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const ZegoCallRoom = () => {
  const { roomID } = useParams();

  const myMeeting = async (element) => {
    // const appID = 1858862931;
      const appID =155807052;
    const serverSecret = "bb68cbe552d4dc6c0e1f4e4bc23af303";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      Date.now().toString(),
      "Aditya"
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: 'Personal link',
          url: `${window.location.origin}/room/${roomID}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
      showPreJoinView: false,
    });
  };

  return (
    <div
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

export default ZegoCallRoom;