import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {Button} from "@mui/material";
import {fetchRoomPlayersByRoomId, fetchRooms} from "../../../../api/httpRequest";
import {useEffect, useState} from "react";

const columns = [
    { id: 'nickname', label: 'NickName', minWidth: 10 },
    { id: 'isocode', label: 'ISO\u00a0Code', minWidth: 5 },
    {
        id: 'score',
        label: 'Score',
        minWidth: 5,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },

];


export default function RoomToggerBox({onClose,onJoin,roomId}) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
   const [rows,setRows]=useState([])

    useEffect(()=>{
        console.log("roomid:",roomId);
       const loadPlayers= async()=>{
          try {
            const roomPlayersData = await fetchRoomPlayersByRoomId(roomId);
            console.log("rows:",roomPlayersData);
            setRows(roomPlayersData);

        } catch (error) {
            console.error("Failed to load rooms:", error);
        }
    };
   if(rows.length===0)loadPlayers();
    },[])
    return (
        <>
            <Paper sx={{width: '100%'}}>
                <TableContainer sx={{maxHeight: 440}}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" colSpan={1}>
                                        Name
                                </TableCell>
                                <TableCell align="center" colSpan={2}>
                                    Details
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{top: 57, minWidth: column.minWidth}}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            </Paper>

            <div style={{display: 'flex', justifyContent: 'flex-end', padding:10,gap: 10  }}>
                <Button variant="contained" onClick={onJoin}>Join</Button>
                <Button variant="contained" onClick={onClose} >Cancel</Button>
            </div>

        </>
    );
}
