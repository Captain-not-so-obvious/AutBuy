import type { CommunityNodeType } from '@n8n/api-types';
import { Logger } from '@n8n/backend-common';
import { GlobalConfig } from '@n8n/config';
import { type INodeTypeDescription } from 'n8n-workflow';
import { CommunityPackagesService } from './community-packages.service';
export type StrapiCommunityNodeType = {
    authorGithubUrl: string;
    authorName: string;
    checksum: string;
    description: string;
    displayName: string;
    name: string;
    numberOfStars: number;
    numberOfDownloads: number;
    packageName: string;
    createdAt: string;
    updatedAt: string;
    npmVersion: string;
    isOfficialNode: boolean;
    companyName?: string;
    nodeDescription: INodeTypeDescription;
};
export declare class CommunityNodeTypesService {
    private readonly logger;
    private globalConfig;
    private communityPackagesService;
    private communityNodeTypes;
    private lastUpdateTimestamp;
    constructor(logger: Logger, globalConfig: GlobalConfig, communityPackagesService: CommunityPackagesService);
    private fetchNodeTypes;
    private updateCommunityNodeTypes;
    private resetCommunityNodeTypes;
    private updateRequired;
    private createIsInstalled;
    getCommunityNodeTypes(): Promise<CommunityNodeType[]>;
    getCommunityNodeType(type: string): Promise<CommunityNodeType | null>;
    findVetted(packageName: string): StrapiCommunityNodeType | undefined;
}
