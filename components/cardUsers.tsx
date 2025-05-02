import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Team {
  id: number;
  name: string;
  logo?: string;
}

interface UserCard {
  id: number;
  name: string;
  photo?: string;
  teams: Team[];
}

interface CardUsersProps {
  users: UserCard[];
}

export default function CardUsers({ users }: CardUsersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-gray-900 border border-purple-800/30 rounded-xl shadow-lg p-6 flex flex-col items-center gap-4"
        >
          <Image
            src={user.photo || '/avatar-default.png'}
            alt={user.name}
            width={80}
            height={80}
            className="rounded-full border-2 border-purple-600 object-cover w-20 h-20"
          />
          <div className="text-lg font-semibold text-gray-100 text-center">
            {user.name}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {user.teams.map((team) => (
              <span
                key={team.id}
                className="flex items-center gap-1 bg-purple-800/80 text-white px-3 py-1 rounded-full text-xs"
              >
                {team.logo && (
                  <Image
                    src={team.logo}
                    alt={team.name}
                    width={18}
                    height={18}
                    className="rounded-full"
                  />
                )}
                {team.name}
              </span>
            ))}
          </div>
          <Link href={`/comunidade/${user.id}`} className="w-full mt-2">
            <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 rounded-lg shadow-md transition-all">
              Ver Perfil
            </Button>
          </Link>
        </div>
      ))}
    </div>
  );
}
