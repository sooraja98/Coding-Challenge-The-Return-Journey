

const userIpValidation=(clientIp)=>{
    const allowedIPs = ['127.0.0.1', '::1',]; // Replace with your allowed IPs or in production we can the ip range
    if (! allowedIPs.includes(clientIp)) {
       return false;
    } else {    
        return true; 
    }

}

module.exports=userIpValidation;