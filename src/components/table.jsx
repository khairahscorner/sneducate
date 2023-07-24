import styled from "styled-components";

export const TableWrapper = styled.div`
  width: 100%;
  background: #fff;
  .scroll-table {
    display: flex;
    min-height: 70px;
  }
  .loading {
    height: 400px;
    position: relative;
    width: 100%;
  }

  .no-data {
    text-align: center;
    display: flex;
    width: 100%;
    align-self: center;
    justify-content: center;
  }
`;

export const Table = styled.table`
  width: 100%;
  min-width: ${(props) => props.tableWidth};
  border-collapse: collapse;
  thead {
    background-color: #e4e4e4;
    tr {
      padding: 0 25px;
    }
    th {
      padding: 20px 0;
      padding-left: 30px;
      text-align: left;
      font-weight: "Maison Medium";
      font-size: 16px;
      line-height: 100%;
      color: #1e2329;
      text-transform: uppercase;
      &:last-child {
        padding-right: 30px;
      }
    }
  }
  .notif-row {
    height: 90px;
  }
`;

export const TableRow = styled.tr`
  padding: 0 25px;
  padding-left: 30px;
  font-size: 14px;
  color: #1e2329;
  height: 60px;
  // cursor: pointer;
  background: #fff;
  &:nth-child(even) {
    background: #abafaf;
  }
  td {
    margin: 15px 0;
    padding-left: 30px;
    color: #1e2329;
    letter-spacing: normal;
    &:last-child {
      padding-right: 30px;
    }
  }
  .td-with-img {
    display: flex;
    align-items: center;
    .img-box {
      margin-right: 5px;
      width: 24px;
      height: 24px;
      svg {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
  .sentence-case {
    text-transform: capitalize;
  }
`;
