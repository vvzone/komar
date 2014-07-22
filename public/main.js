/** @jsx React.DOM */


/*
React.renderComponent(
    <Search entity_name='positions' />,
    document.getElementById('main_top')
);

*/


React.renderComponent(
    <CatScreen cat="base"/>,
    document.getElementById('left_panel')
);


React.renderComponent(
    <MainWindow />,
    document.getElementById('main_main')
);






