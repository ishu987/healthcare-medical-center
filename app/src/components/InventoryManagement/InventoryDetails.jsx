import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import PropTypes from 'prop-types';
import { TextField, Paper,Box,Modal, Button, Grid, Typography, IconButton, Table, TableBody, TableContainer, TableFooter, TablePagination, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle  } from '@material-ui/core/';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import DateRangeIcon from '@material-ui/icons/DateRange';
import Pdf from "react-to-pdf";
import useStyles from './styles';
import Fade from '@material-ui/core/Fade';
import GetAppIcon from '@material-ui/icons/GetApp';

const refPrint = React.createRef();

const schema = yup.object().shape({
    productType: yup.string().required("Select Product Type"),
    productName: yup.string().required("Enter the Product Name"),
    quantity: yup.string().required("Enter the Quantity"),
    pricePeritem: yup.string().required("Enter the Price"),
    manfDate: yup.string().required("Manufacture Date is required."),
    expDate: yup.string().required("Expire Date is required."),
    brand: yup.string().required("You must enter the Products brand"),
    description: yup.string().required('You must enter a Description'),
});

const productTypes = [
    {
      value: 'default',
      label: 'Select Product Type',
    },
    {
      value: 'Drug',
      label: 'Drug',
    },
    {
      value: 'Equipment',
      label: 'Equipment',
    },
];

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

const InventoryDetails = () => {
        const { invDetails } = useParams();
        const classes = useStyles();
        const { control, handleSubmit, reset, formState: { errors }  } = useForm(
            {
                resolver: yupResolver(schema),
                reValidateMode: 'onSubmit',
            }
        );
        const [productType, setProductType] = React.useState('default');
        const [position, setPosition] = React.useState('default');
        const [successMsg, setSuccessMsg] = useState(true);
        const [openModal, setOpenModal] = React.useState(false);
        const [gender, setGender] = useState("");
        const [inventoryData, setInventoryData] = React.useState([]);

        const style = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
        };
    
        const CssTextField = withStyles({
            root: {
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

        const history = useHistory();
        const [opendlt, setOpendlt] = React.useState(false);
        const [inventory, setInventory] = React.useState([]);
        const [productId, setProductId] = useState("");
        const [formData, setFormData] = useState([]);
        
        const { id } = useParams();

        const handleClickOpen = () => {
            setOpendlt(true);
            setProductId(id);
        };

        const handleClose = () => {
            setOpendlt(false);
            history.push('/all-inventory')
        };

        const [open, setOpen] = React.useState(false);
        const handleOpenUpdate = () => setOpen(true);
        const handleCloseUpdate = () => setOpen(false);

        useEffect(() => {
            fetch("http://localhost:5000/api/invMngmnt/getInvMngmnt/"+id)
            .then(res => {
                if(res.ok){
                    return res.json()
                }
            }).then(jsonRes => setInventory(jsonRes));
    
        }, [])

        const deletePayment = () => {
            console.log(setProductId)
            axios
            .delete("http://localhost:5000/api/invMngmnt/deleteInvMngmnt/" + productId)
            .then((res) => {
                if(res.status == 200){
                    console.log("Payment Deleted Successfully");
                }
            })
            .catch((err) => {
                console.log(err)
            })
    
            handleClose();
        }

        const onSubmit = (data) => {
    
            const dataFromForm =  [{
                productId:id,
                productType: data.productType,
                productName: data.productName,
                quantity: data.quantity,
                pricePerItem: data.pricePeritem,
                manufactureDate: data.manfDate,
                expiredDate: data.expDate,
                description: data.description,
                brand: data.brand,
              }]
    
              console.log(dataFromForm)
    
            axios
            .post("http://localhost:5000/api/invMngmnt/updateInvMngmnt", dataFromForm)
            .then((res) => {
                if(res.status == 200){
                    console.log("Item details Updated Successfully");
                    history.push('/all-inventory');
                }
            })
            .catch((err) => {
                console.log(err)
            })
        }
        
        const submitForm = (data) => {
            reset({
                keepErrors: true,
            });
        }

        const handlesetProductType = (event) => {
            setProductType(event.target.value, console.log(productType));
        };

        const handleSuccessMsg = (event, reason) => {

            if (reason === 'clickaway') {
              return;
            }
        
            setSuccessMsg(false);
        };

        const handleProductType = (event) => {
            setProductType(event.target.value, console.log(productType));
        };

        const handleOpenModal = (row) => {
            setOpenModal(true);
            // console.log(row);
            setInventoryData(row);
        };

        const handleCloseModal = () => {
            setOpenModal(false);
        };

        // const modalBody = (
        //         <div>
        //             <div ref={refPrint}>
        //                 <Grid container spacing={3} className={classes.modelPaper} >
        //                     <Paper className={classes.paperTitle}>
        //                         <Typography variant="h4" className={classes.pageTitle}>Item Details</Typography>
        //                         <Typography variant="h6" id="transition-modal-title" className={classes.reportTitle}>Item ID :{id}</Typography>
        //                     </Paper>
                            
        //             <table className={classes.table}>
        //                     <tr style={{ fontSize: "20px" }}>
        //                     <td className={classes.trINV}>Product Type : {inventory.productType} </td>
        //                 </tr>
        //                 <tr style={{ fontSize: "20px" }}>
        //                     <td className={classes.trINV}>Product Name : {inventory.productName}</td>
        //                     <td className={classes.trINV}>Quantity : {inventory.quantity}</td>
        //                 </tr>
        //                 <tr style={{ fontSize: "20px" }}>
        //                     <td className={classes.trINV}>Brand : {inventory.brand}</td>
        //                     <td className={classes.trINV}>Price : {inventory.pricePerItem}</td>
        //                 </tr>
        //                 <tr style={{ fontSize: "20px" }}>
        //                     <td className={classes.trINV}>Manufacture Date : {inventory.manufactureDate}</td>
        //                     <td className={classes.trINV}>Expiration Date : {inventory.expiredDate}</td>
        //                 </tr>
        //                 <tr style={{ fontSize: "20px" }}>
        //                     <td className={classes.trINV}>Description : {inventory.description}</td>
        //                 </tr>
        //             </table>

        //                 </Grid>
        //             </div>
        //             <Pdf targetRef={refPrint} filename={inventoryData.productName + " Item details.pdf"}>
        //             {({toPdf}) => (
        //                 <Button onClick={toPdf} variant="contained" className={classes.dialogBtnBlue} startIcon={<GetAppIcon />}>Download Details</Button>
        //             )}
        //         </Pdf> 
        //         </div>
        // );

    return (
        <div>
            <Grid container spacing={3} className={classes.modelPaper}  style={{marginLeft:500}} >
                <Grid item xs={12}>
                    <Paper className={classes.paperTitle}>
                        <Typography variant="h4" className={classes.pageTitle}>Item Details</Typography>
                        <Typography variant="h6" id="transition-modal-title" className={classes.reportTitle}>Item ID :{id}</Typography>
                    </Paper>

                    <table className={classes.table}>
                        <tr style={{ fontSize: "20px" }}>
                            <td className={classes.trINV}>Product Type : {inventory.productType} </td>
                        </tr>
                        <tr style={{ fontSize: "20px" }}>
                            <td className={classes.trINV}>Product Name : {inventory.productName}</td>
                            <td className={classes.trINV}>Quantity : {inventory.quantity}</td>
                        </tr>
                        <tr style={{ fontSize: "20px" }}>
                            <td className={classes.trINV}>Brand : {inventory.brand}</td>
                            <td className={classes.trINV}>Price : {inventory.pricePerItem}</td>
                        </tr>
                        <tr style={{ fontSize: "20px" }}>
                            <td className={classes.trINV}>Manufacture Date : {inventory.manufactureDate}</td>
                            <td className={classes.trINV}>Expiration Date : {inventory.expiredDate}</td>
                        </tr>
                        <tr style={{ fontSize: "20px" }}>
                            <td className={classes.trINV}>Description : {inventory.description}</td>
                        </tr>
                    </table>

                    <Grid item xs={6}>
                        <Button variant="contained" color="primary" className={classes.detailsUpdateBtn} onClick={handleOpenUpdate}>
                        Update Item Details
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="secondary" className={classes.detailsDeleteBtn} onClick={handleClickOpen}>
                        Delete Item
                        </Button>
                    </Grid>
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
                        <Button onClick={deletePayment} variant="contained" className={classes.dialogBtnRed} autoFocus>
                            Yes, Delete it
                        </Button>
                    </DialogActions>
                </Paper>
            </Dialog>
                {/* {modalBody} */}
            <div>
                <Modal
                open={open}
                    onClose={handleCloseUpdate}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                        <Box sx={style} style={{width:800}}>
                        <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paperTitle}>
                        <Typography variant="h4" className={classes.pageTitle}>Update Item Details</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                        <Paper className={classes.paper}>
                            <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                    <Controller
                                            name="productType"
                                            control={control}
                                            defaultValue={inventory.productType}
                                            render={({ field }) => 
                                            <CssTextField
                                                fullWidth
                                                select
                                                label="Product Type"
                                                value={productType}
                                                onChange={handleProductType}
                                                variant="outlined"
                                                error={!!errors?.productType}
                                                helperText={errors?.productType?.message}
                                                {...field}
                                                >
                                                {productTypes.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </CssTextField>}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="productName"
                                            control={control}
                                            defaultValue={inventory.productName}
                                            render={({ field }) => 
                                            <CssTextField 
                                            fullWidth 
                                            label="Product Name" 
                                            variant="outlined" 
                                            color="primary" 
                                            error={!!errors?.productName}
                                            helperText={errors?.productName?.message} 
                                            {...field} />}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <Controller
                                            name="quantity"
                                            control={control}
                                            defaultValue={inventory.quantity}
                                            render={({ field }) => 
                                            <CssTextField 
                                            fullWidth label="Quantity" 
                                            variant="outlined" 
                                            color="primary"
                                            error={!!errors?.quantity}
                                            helperText={errors?.quantity?.message} 
                                            {...field} />}
                                        />
                                    </Grid> 

                                    <Grid item xs={12} sm={3}>
                                        <Controller
                                            name="pricePeritem"
                                            control={control}
                                            defaultValue={inventory.pricePerItem}
                                            render={({ field }) => 
                                            <CssTextField 
                                            fullWidth label="Price Per Item" 
                                            variant="outlined" 
                                            color="primary"
                                            error={!!errors?.pricePeritem}
                                            helperText={errors?.pricePeritem?.message} 
                                            {...field} />}
                                        />
                                    </Grid> 

                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="description"
                                            control={control}
                                            defaultValue={inventory.description}
                                            render={({ field }) => 
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Description"
                                                fullWidth
                                                multiline
                                                rows={4}
                                                defaultValue=""
                                                color="primary"
                                                variant="outlined"
                                                error={!!errors?.description}
                                                helperText={errors?.description?.message} 
                                                {...field}
                                            />}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <Controller
                                            name="manfDate"
                                            control={control}
                                            defaultValue={inventory.manufactureDate}
                                            render={({ field }) => 
                                                <CssTextField
                                                    fullWidth
                                                    label="Manufacture Date"
                                                    type="date"
                                                    variant="outlined"
                                                    color="primary"
                                                    error={!!errors?.manfDate}
                                                    helperText={errors?.manfDate?.message} 
                                                    {...field}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                          <InputAdornment position="start">
                                                            <DateRangeIcon />
                                                          </InputAdornment>
                                                        ),
                                                    }}
                                            />}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <Controller
                                            name="expDate"
                                            control={control}
                                            defaultValue= {inventory.expiredDate}
                                            render={({ field }) => 
                                                <CssTextField
                                                    fullWidth
                                                    label="Expiration Date"
                                                    type="date"
                                                    variant="outlined"
                                                    color="primary"
                                                    error={!!errors?.expDate}
                                                    helperText={errors?.expDate?.message} 
                                                    {...field}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                          <InputAdornment position="start">
                                                            <DateRangeIcon />
                                                          </InputAdornment>
                                                        ),
                                                    }}
                                            />}
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="brand"
                                            control={control}
                                            defaultValue={inventory.brand}
                                            render={({ field }) => 
                                            <CssTextField  
                                            fullWidth 
                                            label=" Brand " 
                                            variant="outlined" 
                                            color="primary" 
                                            error={!!errors?.brand}
                                            helperText={errors?.brand?.message}
                                            {...field} />}
                                        />
                                    </Grid>  

                            </Grid>
                        </Paper>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={3}>
                                <Button type="reset" fullWidth variant="contained" className={classes.resetbtn}
                                onClick={() => {
                                    reset({
                                      keepErrors: true,
                                    });
                                  }}>
                                    Reset
                                </Button>
                            </Grid>    
                            <Grid item xs={12} sm={9}>
                                <Button type="submit" fullWidth variant="contained" color="secondary" className={classes.submitbtn}>
                                    Update
                                </Button>
                            </Grid>
                        </Grid> 

                    </form>
                </Grid>

                        </Grid>
                        </Box>
                </Modal>
            </div>

        </div>

        
    )
}

export default InventoryDetails