import { Box, Button, Card, CardContent, CardMedia, Divider, Grid, Skeleton } from "@mui/material";
import { RefObject, useEffect, useRef, useState } from "react";
import "./nasa-info.css";

interface IAPIDataFormat {
  copyright?: string;
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

interface IRenderSportLightProps {
  data: IAPIDataFormat;
}

interface IRenderScrollableItems {
  data: IAPIDataFormat[];
  onCardClick: (date: string) => void;
}

export default function InfoByNASAPage() {
  const [currentSelectedData, setCurrentSelectedData] = useState<IAPIDataFormat>({} as IAPIDataFormat);
  const [data, setData] = useState([]);
  const nasaLogo = require("./images/nasaLogo.png");
  const [lastDate, setLastDate] = useState<Date>();


  const getLastDate = (data: IAPIDataFormat[]) => {
    let dataArray = [];

    for (let i = 0; i < data.length; i = i + 7) {
      dataArray.push(data.slice(i, i + 7));
    }
    if (dataArray[dataArray.length - 1].length < 7) dataArray.pop();
    const lastElement = dataArray[dataArray.length - 1];
    const lastElementDate = lastElement[lastElement.length - 1].date;
    setLastDate(new Date(lastElementDate));
  }

  const getDataBetweenDates = async (fromDate: string, toDate: string) => {
    await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=gaff4Pwpu0Qg6woyFty1YhVRxhj4In1ImvOCyFD7&start_date=${fromDate}&end_date=${toDate}&thumbs=true`
    ).then((res) => res.json())
      .then((res) => {
        setData(data.length ? [...data, ...res] : res);
        setCurrentSelectedData(res[res.length - 1]);
        getLastDate(res);
      })
      .catch((e) => console.log(e));
  };

  const getDateFormatted = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  useEffect(() => {
    const currentDate = new Date('Fri Dec 29 2022 00:08:25');
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    getDataBetweenDates(
      getDateFormatted(lastMonthDate),
      getDateFormatted(currentDate)
    );
  }, []);

  const onCardClick = (date: string) => {
    setCurrentSelectedData({} as IAPIDataFormat);
    setData([]);
    const searchedDate = new Date(date);
    let lastMonthDateOfSearchedDate = new Date(date);
    lastMonthDateOfSearchedDate.setMonth(searchedDate.getMonth() - 1);
    getDataBetweenDates(getDateFormatted(lastMonthDateOfSearchedDate), getDateFormatted(searchedDate));
  }

  const addAdditionalData = () => {
    const searchedDate = new Date(String(lastDate));
    let lastMonthDateOfSearchedDate = new Date(String(lastDate));
    lastMonthDateOfSearchedDate.setMonth(searchedDate.getMonth() - 1);
    getDataBetweenDates(getDateFormatted(lastMonthDateOfSearchedDate), getDateFormatted(searchedDate));
  }

  const handleScroll = (e: any) => {
    const userScroll = e.target.scrollHeight - e.target.scrollTop;
    const elementHeight = e.target.clientHeight;
    if (userScroll === elementHeight || userScroll < elementHeight - 10) addAdditionalData();

  }


  return (
    <div className="PaperGrid" onScroll={handleScroll} >
      <Box className="SelectedInformationWrapper">
        <Box className="HeaderContent">
          <Box className="NasaLogoContainer">
            <img src={nasaLogo} width="25%" />
            <h1>Purv Jeja</h1>
          </Box>
          {
            Object.keys(currentSelectedData).length ? (
              currentSelectedData.media_type === 'video' ?
                <CardMedia
                  component='iframe'
                  sx={{ height: 140 }}
                  src={currentSelectedData.url}
                /> :
                <CardMedia
                  sx={{ height: 140 }}
                  image={currentSelectedData.url}
                />
            ) : (<Skeleton width="80%" height="100%" />)
          }
        </Box>
        <Box className="SpotLight">
          <Divider />
          {
            Object.keys(currentSelectedData).length ? <RenderSpotLight data={currentSelectedData} /> : <Skeleton width="80%" height="100%" />
          }
        </Box>
      </Box>

      <Box className="InfiniteScroll">
        {
          data.length ? <RenderScrollableItems data={data} onCardClick={onCardClick} />
            : <Skeleton width="80%" height="100%" />
        }
      </Box>
    </div>
  );
}


function RenderSpotLight(props: IRenderSportLightProps) {
  const { data } = props;

  return (
    <Box className="SpotLightContent">
      <Box className="SpotLightText">
        <h2>{data.title}</h2>
        <p>{data.explanation}</p>
        <p>{data.copyright}</p>
      </Box>
      <Box className="SpotLightImage">
        {
          data.media_type === 'video' ?
            <CardMedia
              component='iframe'
              sx={{ height: 140 }}
              src={data.url}

            /> :
            <CardMedia
              sx={{ height: 140 }}
              image={data.url}
            />
        }
      </Box>
    </Box>
  )
}

function RenderScrollableItems(props: IRenderScrollableItems) {
  const { data, onCardClick } = props;

  const getPreparedData = (data: IAPIDataFormat[]) => {
    let dataArray = [];

    for (let i = 0; i < data.length; i = i + 7) {
      dataArray.push(data.slice(i, i + 7));
    }

    if (dataArray[dataArray.length - 1].length < 7) dataArray.pop();
    return dataArray;
  }


  const formattedData = getPreparedData(data);

  return (
    <Box className="ScrollableItemContent">
      {
        formattedData.map(rowData => (
          <Box key={rowData[0].date} className="RowCardsContainer">
            {
              rowData.map(data => (
                <Card key={data.date} className="Card" onClick={() => onCardClick(data.date)}>
                  {
                    data.media_type === 'video' ?
                      <CardMedia
                        component='iframe'
                        sx={{ height: 140 }}
                        src={data.url}

                      /> :
                      <CardMedia
                        sx={{ height: 140 }}
                        image={data.url}
                      />
                  }
                  <CardContent>
                    <h4>{data.title}</h4>
                    <p>{data.date}</p>
                  </CardContent>
                </Card>
              )
              )
            }
          </Box>
        ))
      }
      <Box>
        <Skeleton width="100%" height="200px" />
      </Box>
    </Box>
  )
}