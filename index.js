                                                                                                                                   
//    ____   ____    _________       _____    __ ______      ___      ___      ______     _____      ___   ____   __________ __________ 
//    6MMMMb/ `MM'    `MM`MM`MMb     dMM`MM    d'  `MM`MM\     `M'      `MM\     `M`MM'     `M`MM\     `M'  6MMMMb/ `MMMMMMMMM MMMMMMMMMM 
//   8P    YM  MM      MM MM MMM.   ,PMM MM   d'   MM MMM\     M        MMM\     M MM       M MMM\     M  8P    YM  MM      \ /   MM   \ 
//  6M      Y  MM      MM MM M`Mb   d'MM MM  d'    MM M\MM\    M        M\MM\    M MM       M M\MM\    M 6M      Y  MM            MM     
//  MM         MM      MM MM M YM. ,P MM MM d'     MM M \MM\   M        M \MM\   M MM       M M \MM\   M MM         MM    ,       MM     
//  MM         MMMMMMMMMM MM M `Mb d' MM MMd'      MM M  \MM\  M        M  \MM\  M MM       M M  \MM\  M MM         MMMMMMM       MM     
//  MM         MM      MM MM M  YM.P  MM MMYM.     MM M   \MM\ M        M   \MM\ M MM       M M   \MM\ M MM     ___ MM    `       MM     
//  MM         MM      MM MM M  `Mb'  MM MM YM.    MM M    \MM\M        M    \MM\M MM       M M    \MM\M MM     `M' MM            MM     
//  YM      6  MM      MM MM M   YP   MM MM  YM.   MM M     \MMM        M     \MMM YM       M M     \MMM YM      M  MM            MM     
//   8b    d9  MM      MM MM M   `'   MM MM   YM.  MM M      \MM        M      \MM  8b     d8 M      \MM  8b    d9  MM      /     MM     
//    YMMMM9  _MM_    _MM_MM_M_      _MM_MM_   YM._MM_M_      \M       _M_      \M   YMMMMM9 _M_      \M   YMMMM9  _MMMMMMMMM    _MM_    
                                                                                                                                      
                                                                                                                                      

// require('dotenv').config();

const server = require('./server.js');

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`API running on port ${port}`);
});