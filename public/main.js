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
    <MainWindow screen_name="doc_type_groups" />, //screen_name="doc_kinds"
    document.getElementById('main_main')
);






