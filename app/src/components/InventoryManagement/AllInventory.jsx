import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { useForm, Controller } from "react-hook-form";
import { TextField, Paper, Button, Grid, Typography, IconButton, Table, TableBody, TableContainer, TableFooter, TablePagination, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle  } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Link } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MuiTableCell from "@material-ui/core/TableCell";

import SearchIcon from '@material-ui/icons/Search';
import SearchBar from "material-ui-search-bar";
import AddIcon from '@material-ui/icons/Add';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Pdf from "react-to-pdf";
import GetAppIcon from '@material-ui/icons/GetApp';
import axios from 'axios';

import useStyles from './styles';

const refPrint = React.createRef();

const useStyles1 = makeStyles((theme) => ({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
}));

function TablePaginationActions(props) {
    const classes = useStyles1();
    const classes1 = useStyles();
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <div className={classes.root}>
        <IconButton
          className={classes1.paginationBtn}
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page"  className={classes1.paginationBtn}>
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          className={classes1.paginationBtn}
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          className={classes1.paginationBtn}
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

const inventoryFD = [
    { "productId" : "0001", "firstName" : "Minerva", "lastName" : "McGonagall", "position" : "Doctor", "paymentAmt" : "Rs.80000.00", "paymentType" : "Visa", "paymentDate" : "22.10.2021"},
    { "productId" : "0001", "firstName" : "Minerva", "lastName" : "McGonagall", "position" : "Doctor", "paymentAmt" : "Rs.80000.00", "paymentType" : "Visa", "paymentDate" : "22.10.2021"},
    { "productId" : "0001", "firstName" : "Minerva", "lastName" : "McGonagall", "position" : "Doctor", "paymentAmt" : "Rs.80000.00", "paymentType" : "Visa", "paymentDate" : "22.10.2021"},
    { "productId" : "0001", "firstName" : "Minerva", "lastName" : "McGonagall", "position" : "Doctor", "paymentAmt" : "Rs.80000.00", "paymentType" : "Visa", "paymentDate" : "22.10.2021"},
    { "productId" : "0001", "firstName" : "Minerva", "lastName" : "McGonagall", "position" : "Doctor", "paymentAmt" : "Rs.80000.00", "paymentType" : "Visa", "paymentDate" : "22.10.2021"},
    { "productId" : "0001", "firstName" : "Minerva", "lastName" : "McGonagall", "position" : "Doctor", "paymentAmt" : "Rs.80000.00", "paymentType" : "Visa", "paymentDate" : "22.10.2021"},
    { "productId" : "0001", "firstName" : "Minerva", "lastName" : "McGonagall", "position" : "Doctor", "paymentAmt" : "Rs.80000.00", "paymentType" : "Visa", "paymentDate" : "22.10.2021"},
    { "productId" : "0001", "firstName" : "Minerva", "lastName" : "McGonagall", "position" : "Doctor", "paymentAmt" : "Rs.80000.00", "paymentType" : "Visa", "paymentDate" : "22.10.2021"},
];

const AllInventory = () => {
    const classes = useStyles();
    const { control, handleSubmit, reset } = useForm();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [opendlt, setOpendlt] = React.useState(false);
    const [searched, setSearched] = useState("");
    const [rows, setRows] = useState([]);
    const [inventory, setInventory] = React.useState([]);
    const [productId, setProductId] = useState("");
    const [openModal, setOpenModal] = React.useState(false);
    const [inventoryData, setInventoryData] = React.useState([]);

    const CssTextField = withStyles({
        root: {
          '& .MuiInputBase-root': { 
            backgroundColor: '#ffffff',
           },
          '& .MuiInputLabel-root': { 
            color: '#6e6e6e',
          },
          '& .MuiTextField-root': {
            color: '#6e6e6e',
          },
          '& .MuiFormHelperText-root': {
            color: '#6e6e6e',
          },
          '& label.Mui-focused': {
            color: '#6e6e6e',
          },
          '& .MuiInputBase-input':{
            color: '#1a1a1a',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#6e6e6e',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#6e6e6e',
            },
            '&:hover fieldset': {
              borderColor: '#0077B6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0077B6',
            },
          },
        },
        input: {
          color: "#1a1a1a"
        }
    })(TextField);

    const TableCell = withStyles({
        root: {
          borderBottom: "none"
        }
    })(MuiTableCell);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, inventoryFD.length - page * rowsPerPage);

    useEffect(() => {
        fetch("http://localhost:5000/api/invMngmnt/viewInvMngmnt")
        .then(res => {
            if(res.ok){
                return res.json()
            }
        }).then(jsonRes => setInventory(jsonRes));

    }, [])

    useEffect(() => {
        setRows(inventory)
    }, [inventory])

    const deleteItem = () => {
        console.log(productId);
        axios
        .delete("http://localhost:5000/api/invMngmnt/deleteInvMngmnt/" + productId)
        .then((res) => {
            if(res.status == 200){
                console.log("Item Deleted Successfully");
            }
        })
        .catch((err) => {
            console.log(err)
        })
        handleClose();
    }

    const handleClickOpen = (productId) => {
        setOpendlt(true);
        setProductId(productId);
        // console.log(productId)
    };
    
    const handleClose = () => {
        setOpendlt(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const requestSearch = (searchedVal) => {
        const filteredRows = inventory.filter((row) => {
          return row.productName.toLowerCase().includes(searchedVal.toString().toLowerCase());
        });
         setRows(filteredRows);
    };
    
    const cancelSearch = () => {
        setSearched("");
        requestSearch(searched);
    };

    const handleOpenModal = (row) => {
        setOpenModal(true);
        // console.log(row);
        setInventoryData(row);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };
    
    const modalBody = (
        <div>
            <div ref={refPrint}>
                <Grid container spacing={3} className={classes.modelPaper} >
                <Grid item xs={12}>
                    <Paper className={classes.paperTitle}>
                        <Typography variant="h4" className={classes.pageTitle}>Item Details</Typography>
                        <Typography variant="h6" id="transition-modal-title" className={classes.reportTitle}>Item ID :{inventoryData.productId}</Typography>
                    </Paper>
                    
            <table className={classes.table}>
                    <tr style={{ fontSize: "20px" }}>
                    <td className={classes.trINV}>Product Type : {inventoryData.productType} </td>
                </tr>
                <tr style={{ fontSize: "20px" }}>
                    <td className={classes.trINV}>Product Name : {inventoryData.productName}</td>
                    <td className={classes.trINV}>Quantity : {inventoryData.quantity}</td>
                </tr>
                <tr style={{ fontSize: "20px" }}>
                    <td className={classes.trINV}>Brand : {inventoryData.brand}</td>
                    <td className={classes.trINV}>Price : {inventoryData.pricePerItem}</td>
                </tr>
                <tr style={{ fontSize: "20px" }}>
                    <td className={classes.trINV}>Manufacture Date : {inventoryData.manufactureDate}</td>
                    <td className={classes.trINV}>Expiration Date : {inventoryData.expiredDate}</td>
                </tr>
                <tr style={{ fontSize: "20px" }}>
                    <td className={classes.trINV}>Description : {inventoryData.description}</td>
                </tr>
            </table>
                <Pdf targetRef={refPrint} filename={inventoryData.productName + " Item details.pdf"}>
                    {({toPdf}) => (
                         <Button onClick={toPdf} variant="contained" className={classes.ReportDetailsBtn} startIcon={<GetAppIcon />}>Download Details</Button>
                    )}
                </Pdf> 
                </Grid>
                </Grid>
            </div>
            
        </div>
);


    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paperTitle}>
                        <Typography variant="h4" className={classes.pageTitle}>Inventory List</Typography>
                    </Paper>
                </Grid>
                <Grid container spacing={3} justifyContent="flex-end" alignItems="center" style={{ padding: "12px",marginLeft:"-95px" }}>
                    <Grid item xs={12} sm={4}>
                        <SearchBar
                            cancelOnEscape
                            value={searched}
                            onChange={(searchVal) => requestSearch(searchVal)}
                            onCancelSearch={() => cancelSearch()}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button component={Link} to ="/add-inventory" fullWidth variant="contained" startIcon={<AddIcon />} color="secondary" className={classes.submitbtn}>
                            Add New Product
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                        <TableContainer>
                            <Table className={classes.table}>
                                <TableBody>
                                    <TableRow component={Paper} className={classes.paper}>
                                        <TableCell component="th" className={classes.tableth} style={{ width: 100 }}>
                                            Product ID
                                        </TableCell>
                                        <TableCell component="th" className={classes.tableth}>
                                            Name
                                        </TableCell>
                                        <TableCell component="th" className={classes.tableth}>
                                            Type
                                        </TableCell>
                                        <TableCell component="th" className={classes.tableth}>
                                            Description
                                        </TableCell>
                                        <TableCell component="th" className={classes.tableth}>
                                            Brand
                                        </TableCell>
                                        <TableCell component="th" className={classes.tableth}>
                                            Quantity
                                        </TableCell>
                                        <TableCell component="th" className={classes.tableth}>
                                            Mnf-Date
                                        </TableCell>
                                        <TableCell component="th" className={classes.tableth}>
                                            Exp-Date
                                        </TableCell>
                                        <TableCell component="th" className={classes.tableth}>
                                            Price
                                        </TableCell>
                                        <TableCell component="th" className={classes.tableth}>
                                            Actions
                                        </TableCell>
                                    </TableRow> <br />
                                    {(rowsPerPage > 0
                                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : rows
                                    ).map((row) => (
                                        <>
                                        <TableRow key={row.name} className={classes.tableRow}>
                                            <TableCell component="th" scope="row" style={{ width: 100 }}>
                                                {row.productId}
                                            </TableCell>
                                            <TableCell component={Link} to={'/details-inventory/' + row.productId} align="left">
                                                {row.productName}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.productType}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.description}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.brand}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.quantity}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.manufactureDate}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.expiredDate}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.pricePerItem}
                                            </TableCell>
                                            <TableCell align="left">
                                                <Button component={Link} to={'/details-inventory/' + row.productId} variant="contained" color="secondary" className={classes.tableBtn}>
                                                    Update
                                                </Button>
                                                <Button variant="contained" className={classes.tableBtnRed} onClick={() => handleClickOpen(row.productId)}>
                                                    Remove
                                                </Button>
                                                <Button variant="contained" className={classes.ReportBtn} onClick={() => handleOpenModal(row)}>
                                                    Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <br />
                                        </>
                                    ))}

                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                        colSpan={12}
                                        style={{ borderBottom:"none" }}
                                        count={inventoryFD.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        SelectProps={{
                                            inputProps: { 'aria-label': 'rows per page' },
                                            native: true,
                                        }}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        ActionsComponent={TablePaginationActions}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                </Grid>
            </Grid>
            <Dialog
                open={opendlt}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Paper className={classes.dialogBox}>
                    <DialogTitle id="alert-dialog-title" style={{ textAlign:"center" }}><DeleteForeverIcon style={{ fontSize: "100px", color: "#ff4040" }} /></DialogTitle>
                    <DialogContent style={{ textAlign:"center" }}> 
                        <DialogContentText id="alert-dialog-description" className={classes.dialogContent}>
                            Are you sure you want to<br /> permanetly delete this record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions style={{ justifyContent:"center" }}>
                        <Button onClick={handleClose} variant="contained"color="secondary" className={classes.dialogBtn}>
                            Cancel
                        </Button>
                        <Button onClick={deleteItem} variant="contained" className={classes.dialogBtnRed} autoFocus>
                            Yes, Delete it
                        </Button>
                    </DialogActions>
                </Paper>
            </Dialog>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={openModal}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
               {modalBody}
            </Modal>
        </div>
    )
}

export default AllInventory
