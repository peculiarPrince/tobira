import React from "react";

import { graphql, useLazyLoadQuery } from "react-relay/hooks";
import { RealmQuery } from "../query-types/RealmQuery.graphql";

import { Breadcrumbs } from "../ui/Breadcrumbs";
import { NavMain as MainLayout } from "../layout/NavMain";


type Props = {
    path: string;
};

export const Realm: React.FC<Props> = ({ path }) => {
    const isRoot = path === "";

    // TODO Build this query from fragments!
    const { realm } = useLazyLoadQuery<RealmQuery>(graphql`
        query RealmQuery($path: String!) {
            realm: realmByPath(path: $path) {
                name
                path
                parents { name path }
                children { id name path }
            }
        }
    `, {
        // The API expects a "leading" slash to non-root paths to separate
        // the first component from the root path segment `''`
        path: isRoot ? "" : `/${path}`,
    });

    if (!realm) {
        // TODO: that should obviously be handled in a better way
        //   Also: I'm not sure whether that's still the only cause for error.
        return <b>{"Realm path not found :("}</b>;
    }

    // Prepare data for breadcrumbs
    const breadcrumbs = realm.parents
        .slice(1)
        .concat(realm)
        .map(({ name, path }) => ({
            label: name,
            href: `/r${path}`,
        }));

    return (
        <MainLayout
            title={isRoot ? undefined : realm.name}
            breadcrumbs={isRoot ? undefined : <Breadcrumbs path={breadcrumbs} />}
            navItems={realm.children.map(({ path, name }) => ({
                label: name,
                link: `/r${path}`,
            }))}
        >
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </MainLayout>
    );
};
