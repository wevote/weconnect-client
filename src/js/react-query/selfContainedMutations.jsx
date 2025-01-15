import { useMutation, useQueryClient } from '@tanstack/react-query';
import weConnectQueryFn from './WeConnectQuery';



export const RemoveTeamMemberMutation = (personId, teamId) => {
  const queryClient = useQueryClient();

  const ret = useMutation({
    mutationFn: () => weConnectQueryFn('remove-person-from-team', {
      personId,
      teamId,
    }),
    onSuccess: () => {
      console.log('--------- removeTeamMemberMutation mutated ---------');
      queryClient.invalidateQueries('team-list-retrieve').then(() => {});
    },
  });
  return ret;
};

export default RemoveTeamMemberMutation;
