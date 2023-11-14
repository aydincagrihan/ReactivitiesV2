using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        //Application Layer Business Logic gibi düşünebiliriz
        //Persistence DataAccess
        //Domain->Entities

        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }
        //FluentValidation Kullanarak bir activity oluştururken title değeri boş ise oluşturulamaması için kontrol koyduk
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }


            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                //Infrastructure projesinden kullanıcı bilgilerine erişmemizi sağlayacak bu şekilde.
                var user=await _context.Users.FirstOrDefaultAsync(x=>x.UserName==_userAccessor.GetUserName());

                var attendee=new ActivityAttendee
                {
                    AppUser=user,
                    Activity=request.Activity,
                    IsHost=true
                };

                _context.Activities.Add(request.Activity);
                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Failed to create activity");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}