import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import history from '../../browserHistorySetup';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: '20vw',
    height: '10vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
}));

export const NestedGrid = ({ data }) => {
  const classes = useStyles();
  const COLUMNS = 3;
  const numRows = Math.floor(data.length / COLUMNS);
  const groups: number[] = [];
  for (let i = 0; i < data.length - data.length % 3; i += 3) {
    groups.push(i)

  }
  console.log('groups', groups);

  let remainderStartIndex = numRows * COLUMNS;
  const remainderList: number[] = [];
  while (remainderStartIndex < data.length) {
    remainderList.push(remainderStartIndex);
    remainderStartIndex += 1;
  }
  console.log('data', data);

  function FormRow({ formRowData }) {
    return (
      <>
        <Grid item xs={4}>
          <Paper className={classes.paper} onClick={() => history.push(`/auction/${formRowData[0].id}`)}>{formRowData[0].itemName}</Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper} onClick={() => history.push(`/auction/${formRowData[1].id}`)}>{formRowData[1].itemName}</Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper} onClick={() => history.push(`/auction/${formRowData[2].id}`)}>{formRowData[2].itemName}</Paper>
        </Grid>
      </>
    );
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        { // main groups based on # of COLUMNS 
          groups.map((group: any) => {
            const index = group;
            return (
              <Grid container item xs={12} spacing={2}>
                <FormRow formRowData={[data[index], data[index + 1], data[index + 2]]} />
              </Grid>
            )
          })
        }
        {
          remainderList.length > 0 ? (remainderList.map((index: any) => {
            return (
              <Grid item xs={4}>
                <Paper className={classes.paper} onClick={() => history.push(`/auction/${data[index].id}`)}>{data[index].itemName}</Paper>
              </Grid>
            )
          })) : null
        }
      </Grid>
    </div>
  );
}