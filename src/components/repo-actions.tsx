import React from "react";
import { Button, Divider, DropdownItem } from "@patternfly/react-core";
import { KebabDropdown } from 'cockpit-components-dropdown.jsx';
import cockpit from "cockpit";

const _ = cockpit.gettext;

export default function RepoActions() {
    const dropdownItems = [];

    dropdownItems.push(
        <DropdownItem>
            {_("Delete")}
        </DropdownItem>
    );

    dropdownItems.push(<Divider key="separator-pause" />);

    return (
        <>
            <Button variant="secondary">
                Start
            </Button>
            {/* <KebabDropdown
                dropdownItems={dropdownItems}
            /> */}
        </>

    );
}
