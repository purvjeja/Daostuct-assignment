import "./App.css";
import { Grid, Paper } from "@mui/material";
import InfoByNASAPage from "./nasa-info";

function App() {
  return (
    <div className="App">
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Paper elevation={24} className="Paper">
          <InfoByNASAPage />
        </Paper>
      </Grid>
    </div>
  );
}

export default App;
