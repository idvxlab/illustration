import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  >div:first-child{
    display: flex;
    flex: 1;
    height: 0;  /* height auto set by flex size, otherwise it will strut by content */ 
  }
`;

export const AssetsContainer = styled.div`
  flex: 0.2;
  display: flex;
  border: 1px solid #ebedf0;

  .menu {
    padding: 18px 0;
    width: 50px;
    overflow-y: scroll;
    border-right: 1px solid #ebedf0;
    i {
      width: 100%;
      font-size: 20px;
      margin-bottom: 18px;
    }
  }
  .assets-list{
    flex: 1;
    padding: 10px;
    overflow: scroll;
  }

`;

export const TimelineWrapper = styled.div`
  height: 200px;
  overflow-y: scroll
`;

export const Handle = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0.8;
  
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ebedf0;
    padding: 10px 20px;
    font-size: 18px;
  }

  .canvas-container {
    flex: 1;
    display: flex;
    justify-content: center;
    position: relative;
    .canvas {
      position: absolute;
      left: 50%;
      top: 50%;
      display: inline-block;
      transform: translate(-50%, -50%);
      border: 2px dashed #ebedf0;
      height: 90%;
        svg {
        width: 100%;
        height: 100%;
      }
    }
  }
`;