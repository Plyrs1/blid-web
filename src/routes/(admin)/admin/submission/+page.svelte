<script lang="ts">
	import ApprovedSubmission from '$lib/components/submission/ApprovedSubmission.svelte';
	import PendingSubmission from '$lib/components/submission/PendingSubmission.svelte';
	import RejectedSubmission from '$lib/components/submission/RejectedSubmission.svelte';
	import { delay } from '$lib/helper/misc';
	import pb from '$lib/pocketbase';
	import type {
		LbApproveLogResponse,
		LbCarsResponse,
		LbCategoryResponse,
		LbRecordResponse,
		UsersResponse
	} from '$lib/pocketbaseType';
	import { newSubmissionCount } from '$lib/stores/admin';
	import { toast } from '$lib/stores/page';
	import { TabItem, Tabs } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let currentPageType: 'pending' | 'approved' | 'rejected' = 'pending';
	let submissionList: Array<
		LbRecordResponse<{ user: UsersResponse; car: LbCarsResponse; category: LbCategoryResponse }>
	> = [];
	let approveLog: Array<
		LbApproveLogResponse<{
			entry: LbRecordResponse<{
				user: UsersResponse;
				car: LbCarsResponse;
				category: LbCategoryResponse;
			}>;
			author: UsersResponse;
		}>
	> = [];
	let searchTerm = '';
	const getSubmissionList = async (
		submissionType: 'pending' | 'approved' | 'rejected' = 'pending'
	) => {
		try {
			submissionList = [];
			await delay(1000);
			const filter = () => {
				switch (submissionType) {
					case 'pending':
						return 'lb_approve_log_via_entry.entry:length = 0';
					case 'approved':
						return 'lb_approve_log_via_entry.isApproved = true';
					case 'rejected':
						return 'lb_approve_log_via_entry.isApproved = false';
				}
			};
			submissionList = (await pb.collection('lb_record').getFullList({
				filter: filter(),
				sort: 'created',
				expand: 'user,car,category',
				fields: 'id,expand.user.name,expand.car.name,time,expand.category,achieved,created,url'
			})) as Array<
				LbRecordResponse<{ user: UsersResponse; car: LbCarsResponse; category: LbCategoryResponse }>
			>;
			console.log({ func: 'getSubmissionList', submissionList });
			$newSubmissionCount = submissionList.length;
		} catch (err) {
			console.error(err);
			$toast = {
				type: 'danger',
				message:
					"Cannot fetch pending submission log. Probably you don't have permission to view it"
			};
		}
	};

	const getApproveLog = async (status: 'pending' | 'approved' | 'rejected') => {
		if (status === 'pending') return;
		try {
			approveLog = [];
			await delay(1000);
			approveLog = (await pb.collection('lb_approve_log').getFullList({
				filter: `isApproved = ${status === 'approved'}`,
				sort: 'updated',
				expand: 'entry,entry.user,entry.car,entry.category,author',
				fields:
					'id,expand.author.name,expand.entry.expand.user.name,expand.entry.expand.car.name,expand.entry.expand.category.category,expand.entry.expand.category.subcategory,isApproved,created,updated'
			})) as Array<
				LbApproveLogResponse<{
					entry: LbRecordResponse<{
						user: UsersResponse;
						car: LbCarsResponse;
						category: LbCategoryResponse;
					}>;
					author: UsersResponse;
				}>
			>;
			console.log({ func: 'getApproveLog', approveLog });
		} catch (err) {
			console.error(err);
			$toast = {
				type: 'danger',
				message:
					"Cannot fetch approved submission log. Probably you don't have permission to view it"
			};
		}
	};

	const onAccept = async (e: CustomEvent<{ id: string }>) => {
		console.log({ file: 'submission+page.svelte', func: 'onAccept', id: e.detail });
		try {
			const { id } = e.detail;
			if (!id) return;
			await pb.collection('lb_approve_log').create({
				entry: id,
				isApproved: true
			});
			$toast = {
				type: 'success',
				message: 'Submission has been accepted successfully',
				duration: 2000
			};
			await getSubmissionList();
		} catch (err) {
			console.error(err);
			$toast = {
				type: 'danger',
				message: 'Cannot accept this submission',
				duration: 2000
			};
		}
	};

	const onReject = async (e: CustomEvent<{ id: string }>) => {
		console.log({ file: 'submission+page.svelte', func: 'onReject', id: e.detail });
		try {
			const { id } = e.detail;
			if (!id) return;
			await pb.collection('lb_approve_log').create({
				entry: id,
				isApproved: false
			});
			$toast = {
				type: 'success',
				message: 'Submission has been rejected successfully',
				duration: 2000
			};
			await getSubmissionList();
		} catch (err) {
			console.error(err);
			$toast = {
				type: 'danger',
				message: 'Cannot reject this submission',
				duration: 2000
			};
		}
	};

	const onAcceptLog = async (e: CustomEvent<{ id: string }>) => {
		console.log({ file: 'submission+page.svelte', func: 'onAcceptLog', id: e.detail });
		try {
			const { id } = e.detail;
			if (!id) return;
			await pb.collection('lb_approve_log').update(id, {
				isApproved: true
			});
			$toast = {
				type: 'success',
				message: 'Reject log has been approved successfully',
				duration: 2000
			};
			await getApproveLog(currentPageType);
		} catch (err) {
			console.error(err);
			$toast = {
				type: 'danger',
				message: "Cannot approve this submission. Probably you don't have permisson to do it",
				duration: 2000
			};
		}
	};

	const onRejectLog = async (e: CustomEvent<{ id: string }>) => {
		console.log({ file: 'submission+page.svelte', func: 'onRejectLog', id: e.detail });
		try {
			const { id } = e.detail;
			if (!id) return;
			await pb.collection('lb_approve_log').update(id, {
				isApproved: false
			});
			$toast = {
				type: 'success',
				message: 'Approve log has been rejected successfully',
				duration: 2000
			};
			await getApproveLog(currentPageType);
		} catch (err) {
			console.error(err);
			$toast = {
				type: 'danger',
				message: "Cannot reject this submission. Probably you don't have permisson to do it",
				duration: 2000
			};
		}
	};

	const onDeleteLog = async (e: CustomEvent<{ id: string }>) => {
		console.log({ file: 'submission+page.svelte', func: 'onDeleteLog', id: e.detail });
		try {
			const { id } = e.detail;
			if (!id) return;
			await pb.collection('lb_approve_log').delete(id);
			$toast = {
				type: 'success',
				message: 'Approve log has been deleted successfully',
				duration: 2000
			};
			await getApproveLog(currentPageType);
		} catch (err) {
			console.error(err);
			$toast = {
				type: 'danger',
				message: "Cannot delete this log. Probably because you don't have permisson to do it.",
				duration: 2000
			};
		}
	};

	onMount(async () => {
		await getSubmissionList();
	});
</script>

<Tabs
	tabStyle="underline"
	contentClass="p-4 bg-black/40 text-white rounded-lg mt-4"
	activeClasses="p-4 text-primary-600 bg-white text-black rounded-t-lg"
	inactiveClasses="p-4 text-white rounded-t-lg hover:text-black hover:bg-white"
>
	<TabItem open title="Pending" on:click={() => getSubmissionList()}>
		<PendingSubmission
			data={submissionList}
			bind:searchTerm
			on:accept={onAccept}
			on:reject={onReject}
			on:refresh={() => getSubmissionList()}
		/>
	</TabItem>
	<TabItem
		title="Approved"
		on:click={() => (currentPageType = 'approved') && getApproveLog(currentPageType)}
	>
		<ApprovedSubmission
			data={approveLog}
			bind:searchTerm
			on:reject={onRejectLog}
			on:delete={onDeleteLog}
			on:refresh={() => (currentPageType = 'approved') && getApproveLog(currentPageType)}
		/>
	</TabItem>
	<TabItem
		title="Rejected"
		on:click={() => (currentPageType = 'rejected') && getApproveLog(currentPageType)}
	>
		<RejectedSubmission
			data={approveLog}
			bind:searchTerm
			on:accept={onAcceptLog}
			on:delete={onDeleteLog}
			on:refresh={() => (currentPageType = 'rejected') && getApproveLog(currentPageType)}
		/>
	</TabItem>
</Tabs>
