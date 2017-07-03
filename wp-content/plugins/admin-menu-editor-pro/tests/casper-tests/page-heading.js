/*
 Test the ability to change the page heading. The heading is the <h2> element at the top of most admin pages.
 For plugins it often matches the menu title, but WordPress admin pages sometimes have different headings.

 Some pages have an "Add New" button, a search box or other UI element(s) in the heading. We need to make sure
 not to accidentally overwrite/destroy those elements.
 */
casper.start();
casper.test.comment('Change the page heading of some admin pages.');

ameTest.deactivateAllHelpers();
ameTest.resetPluginConfiguration();
ameTest.thenLoginAsAdmin();
ameTest.thenOpenMenuEditor();

casper.then(function() {
	ameTest.loadDefaultMenu();

	//Try it with one of the default submenus that has an "Add New" button.
	ameTest.selectItemByTitle('Posts', 'All Posts', true);
	casper.click('.ws_item.ws_active .ws_toggle_advanced_fields');
	ameTest.setItemFields({
		'page_heading': 'My Custom Heading'
	}, 'submenu');

	//...and a normal submenu with no UI elements in the heading.
	ameTest.selectItemByTitle('Appearance', 'Widgets', true);
	casper.click('.ws_item.ws_active .ws_toggle_advanced_fields');
	ameTest.setItemFields({
		'page_heading': 'Another Heading'
	}, 'submenu');

	casper.click('#ws_save_menu');
});

//Wait for the "settings saved" message.
casper.waitForSelector('#message.updated');

casper.thenOpen(ameTestConfig.adminUrl + '/edit.php', function() {
	casper.test.assertSelectorHasText(
		'.wrap > h2:first-child',
		'My Custom Heading',
		'The "Posts" heading was changed to "My Custom Heading"'
	);
	casper.test.assertExists(
		'.wrap > h2 .add-new-h2',
		'The "Add New" button still exists'
	);
});

casper.thenOpen(ameTestConfig.adminUrl + '/widgets.php', function() {
	casper.test.assertSelectorHasText(
		'.wrap > h2:first-child',
		'Another Heading',
		'The "Widgets" heading was changed to "Another Heading"'
	);
});


casper.run(function() {
	this.test.done();
});