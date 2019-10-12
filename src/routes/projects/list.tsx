import { Route } from "mobx-router";
import * as React from 'react';
import { transaction, when } from "mobx";

import { App, setNavigationContent } from "../../internal";
import store, { IRootStore } from "../../stores/RootStore";
import { IViewAction } from "../../stores/ViewStore";
import { Projects } from "../../components/Pages/Projects/Projects";

export const goToProjects = (tab: ProjectsTab = "active") => {
    store.router.goTo(routes.projects, {}, store, { tab });
}

export type ProjectsTab = "active" | "archived";

const setActions = (tab: ProjectsTab, s: IRootStore) => {
    when(() => store.user.authenticatedUser !== undefined, () => {
        // reactionDisposer && reactionDisposer();
        switch (tab) {
            case "active":
                const deleteAction: IViewAction = {
                    action: () => {
                        s.view.selection.size && s.projects.deleteProjects(...s.view.selection.keys());
                        s.view.selection.clear();
                    },
                    icon: { label: "Delete", content: "delete" },
                    shortKey: { key: "Delete", ctrlKey: true },
                    contextual: true,
                    selection: store.view.selection,
                };

                const archiveAction: IViewAction = {
                    action: () => {
                        s.projects.archiveProjects(...s.view.selection.keys());
                        s.view.selection.clear();
                    },
                    icon: { label: "Archive", content: "archive" },
                    shortKey: { key: "e" },
                    contextual: true,
                    selection: store.view.selection,
                };

                s.view.setActions([deleteAction, archiveAction]);

                break;

            case "archived":

                const unarchiveAction: IViewAction = {
                    action: () => {
                        s.projects.unarchiveProjects(...s.view.selection.keys());
                        s.view.selection.clear();
                    },
                    icon: { label: "Unarchive", content: "unarchive" },
                    contextual: true,
                    shortKey: { key: "e" },
                    selection: store.view.selection,
                };

                s.view.setActions([unarchiveAction]);

                break;
        }
    });
}

const path = '/projects'
const routes = {
    projects: new Route({
        path,
        component: <App><Projects></Projects></App>,
        onEnter: (route: Route, _params, s: IRootStore, queryParams: { tab: ProjectsTab }) => {
            setActions(queryParams.tab, s);
            setNavigationContent(route, false);
        },
        onParamsChange: (_route, _params, s: IRootStore, queryParams: { tab: ProjectsTab }) => {
            transaction(() => {
                s.projects.setProjectId(undefined);
                s.view.selection.clear();
            });
            setActions(queryParams.tab, s);
        },
        title: "Projects",
        beforeExit: (_route, _param, s: IRootStore) => {
            transaction(() => {
                s.projects.setProjectId(undefined);
                s.view.selection.clear();
            });
        }
    })
};

export default routes;
