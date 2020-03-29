import React from "react";
import store from "../../../stores/root-store";
import { IFavoriteRegistrationGroup } from "../../../../common/dist";
import { observer } from "mobx-react-lite";

export interface IWithFavoriteGroupsProps {
    groups: (IFavoriteRegistrationGroup & { id: string })[];
}

export type Props = IWithFavoriteGroupsProps;

export function withFavoriteGroups<T extends Props = Props>(
    WrappedComponent: React.ComponentType<T>
) {
    const ComponentWithFavoriteGroups = (props: Optionalize<T, IWithFavoriteGroupsProps>) => {
        return store.favorites.favoriteGroupCollection.isFetched
            ? <WrappedComponent
                groups={store.favorites.favoriteGroupCollection.docs.map(doc => ({ ...doc.data!, id: doc.id }))}
                {...(props as T)}
            />
            : <></>;
    }

    return observer(ComponentWithFavoriteGroups);
}

export default withFavoriteGroups;